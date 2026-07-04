# AWS EC2 Deployment Guide

This guide provides the exact step-by-step commands to deploy this application to a fresh Ubuntu 22.04 EC2 instance.

## 1. Initial Server Setup & Firewall
SSH into your EC2 instance and run these commands to update packages and configure the firewall:
```bash
sudo apt update && sudo apt upgrade -y
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 2. Install Dependencies (Node.js, PM2, Nginx)
```bash
# Install Node.js (Version 20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

## 3. Clone Repository & Setup Environment
```bash
# Clone the repo (replace with your actual URL)
git clone https://github.com/YOUR_USERNAME/coligo-assessment.git
cd coligo-assessment/backend

# Create .env file with your production database credentials
nano .env
```
Add the following to the `.env` file (adjust with your AWS RDS or local MySQL credentials):
```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_pass
DB_NAME=payment_collection
PORT=5000
```

## 4. Initial Build & PM2 Start
```bash
# Install packages and build
npm install
npm run build

# Start the application with PM2
pm2 start ecosystem.config.js
pm2 save

# Setup PM2 to start on server boot
pm2 startup
# (Run the command that PM2 outputs here)
```

## 5. Configure Nginx Reverse Proxy
```bash
# Copy the provided nginx configuration
sudo cp ../deployment/nginx.conf /etc/nginx/sites-available/payment-api

# Enable the site
sudo ln -s /etc/nginx/sites-available/payment-api /etc/nginx/sites-enabled/

# Remove default nginx site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## 6. Setup GitHub Actions CI/CD
To enable automatic deployments when you push to `main`, go to your GitHub repository -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**.

Add the following three secrets:
1. `EC2_HOST`: Your EC2 Public IP address (e.g., `54.234.12.190`)
2. `EC2_USERNAME`: Usually `ubuntu` for Ubuntu EC2 instances.
3. `EC2_SSH_KEY`: The complete contents of your `.pem` private key file used to SSH into the instance.

Now, every push to the `main` branch will automatically deploy to your EC2 instance!
