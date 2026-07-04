# Production Deployment Guide

This guide details the exact steps used to deploy the Payment Collection Application to an AWS EC2 instance running Ubuntu 22.04.

## Infrastructure Overview
- **Server**: AWS EC2 (Ubuntu 22.04 LTS)
- **Public IP**: `51.21.218.63`
- **Domain Name**: `pay-app.duckdns.org`
- **Web Server**: Nginx
- **Process Manager**: PM2
- **Database**: MySQL

## 1. AWS EC2 Setup
1. Launch an EC2 instance running Ubuntu.
2. In the AWS Security Group, open the following inbound ports:
   - **22 (SSH)** - For deployment and administration.
   - **80 (HTTP)** - For web traffic.
   - **443 (HTTPS)** - For secure web traffic (future SSL setup).
   - **3306 (MySQL)** - Optional: only open if connecting to MySQL remotely.

## 2. Server Provisioning
SSH into the server:
```bash
ssh -i /path/to/key.pem ubuntu@51.21.218.63
```

Update system packages:
```bash
sudo apt update
sudo apt upgrade -y
```

### Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Install PM2
```bash
sudo npm install -g pm2
pm2 startup
```

### Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Install MySQL
```bash
sudo apt install -y mysql-server
sudo mysql_secure_installation
```
Log into MySQL (`sudo mysql`) and create the database and user:
```sql
CREATE DATABASE payment_collection;
CREATE USER 'your_db_user'@'localhost' IDENTIFIED BY 'your_db_pass';
GRANT ALL PRIVILEGES ON payment_collection.* TO 'your_db_user'@'localhost';
FLUSH PRIVILEGES;
```

## 3. Directory Setup
Create deployment directories and set ownership:
```bash
# Backend Directory
sudo mkdir -p /var/www/payment-collection-backend
sudo chown -R ubuntu:ubuntu /var/www/payment-collection-backend

# Frontend Directory
sudo mkdir -p /var/www/payment-collection-frontend
sudo chown -R www-data:www-data /var/www/payment-collection-frontend
```

## 4. Backend Deployment
The backend is deployed automatically via GitHub Actions, but the initial manual setup is:
1. Clone the repository into `/var/www/payment-collection-backend`.
2. Create the `.env` file:
```bash
nano /var/www/payment-collection-backend/.env
```
Populate `.env`:
```env
PORT=5000
NODE_ENV=production
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_pass
DB_NAME=payment_collection
```
3. Install dependencies and build:
```bash
cd /var/www/payment-collection-backend
npm install
npm run build
```
4. Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
```

## 5. Nginx Reverse Proxy Configuration
Create the Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/payment-collection
```
Insert the following configuration:
```nginx
server {
    listen 80;
    server_name pay-app.duckdns.org 51.21.218.63;

    # Serve the React Native Web App
    location / {
        root /var/www/payment-collection-frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Reverse proxy for the Node.js Backend API
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Real IP headers
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/payment-collection /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 6. DuckDNS Configuration
1. Go to DuckDNS and sign in.
2. Create the domain `pay-app`.
3. Point the IP address to the EC2 Public IP: `51.21.218.63`.

## 7. Monitoring Commands
- **Check Backend Logs**: `pm2 logs payment-collection-api`
- **Check PM2 Status**: `pm2 status`
- **Check PM2 Dashboard**: `pm2 monit`
- **Check Nginx Access Logs**: `sudo tail -f /var/log/nginx/access.log`
- **Check Nginx Error Logs**: `sudo tail -f /var/log/nginx/error.log`

## 8. Health Check Commands
Verify the backend API is responding locally:
```bash
curl -I http://localhost:5000/api/customers
```
Verify via public URL:
```bash
curl -I http://pay-app.duckdns.org/api/customers
```

## 9. Restart Procedures
To restart the Node API (e.g., after env changes):
```bash
pm2 restart payment-collection-api
```
To restart Nginx:
```bash
sudo systemctl restart nginx
```

## 10. Rollback Procedures
If a deployment fails:
1. Revert the commit in GitHub and push to `main` to trigger the CI/CD pipeline to redeploy the previous stable state.
2. Alternatively, manually checkout the previous git hash on the EC2 server and rebuild:
```bash
cd /var/www/payment-collection-backend
git checkout <previous_commit_hash>
npm run build
pm2 restart payment-collection-api
```
