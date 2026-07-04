# Continuous Integration and Continuous Deployment (CI/CD)

This document explains the CI/CD implementation for the Payment Collection Application, utilizing GitHub Actions to automate deployments directly to our AWS EC2 infrastructure.

## Deployment Flow Diagram

```mermaid
graph TD
    A[Developer Pushes Code] --> B[GitHub Repository]
    B -->|Triggers Push to 'main'| C[GitHub Actions]
    
    subgraph GitHub Actions Pipeline
    C --> D[Checkout Code]
    D --> E[Setup Node.js]
    E --> F[Install Dependencies]
    F --> G[Build Project]
    G --> H[SSH/SCP into EC2]
    end
    
    subgraph AWS EC2 Instance
    H --> I[Sync Files to /var/www]
    I --> J[Restart PM2 (Backend) / Serve Nginx (Frontend)]
    end
```

## GitHub Actions Workflows

We use two separate workflows, one in each repository:
1. **Backend Deployment**: `.github/workflows/deploy.yml` in the `payment-collection-backend` repository.
2. **Frontend Deployment**: `.github/workflows/deploy.yml` in the `payment-collection-mobile` repository.

## Secrets Configuration
Both repositories require the following **Repository Secrets** configured in GitHub:
- `EC2_HOST`: The public IP of the EC2 instance (`51.21.218.63`).
- `EC2_USERNAME`: The SSH user (`ubuntu`).
- `EC2_SSH_KEY`: The private `.pem` key to access the EC2 instance.

## Backend Pipeline
The backend pipeline automates the deployment of the Node.js API.

### Build Process
1. Checks out the code.
2. Sets up Node 20.
3. Runs `npm install`.
4. Runs `npm run build` to compile TypeScript to JavaScript.

### Deployment Process
Instead of pushing raw code and building on the server, we build on the GitHub runner and push the compiled artifacts.
1. The `appleboy/ssh-action` logs into the EC2 instance.
2. Pulls the latest changes into `/var/www/payment-collection-backend`.
3. Runs `npm install --production`.
4. Restarts the PM2 process: `pm2 restart payment-collection-api`.

## Frontend Pipeline
The frontend pipeline builds the React Native Expo web bundle and serves it via Nginx.

### Build Process
1. Checks out the code.
2. Sets up Node 20.
3. Runs `npm install`.
4. Runs `npx expo export -p web` to generate the static web bundle in the `dist/` folder.

### Deployment Process
1. **Upload**: Uses `appleboy/scp-action` to securely copy the `dist/` folder contents to a temporary home directory on the EC2 instance (`~/payment-collection-frontend`).
2. **Sync**: Uses `appleboy/ssh-action` to run `sudo rsync` to move the files into the protected `/var/www/payment-collection-frontend` directory.
3. **Permissions**: Sets `www-data` ownership so Nginx can securely serve the files to the public.
