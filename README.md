# Payment Collection Backend API

## Project Overview
The backend service for the Payment Collection Application. It provides a robust, secure RESTful API built with Node.js and Express to manage customer loan accounts and process EMI payments. It uses MySQL with Sequelize ORM for data persistence and is deployed on AWS EC2.

**Production URL**: http://pay-app.duckdns.org/api
**Repository**: https://github.com/Athul666MS/payment-collection-backend.git

## Features
- **Customer Management**: Retrieve loan details by account number.
- **Payment Processing**: Process EMI payments and calculate remaining balances securely.
- **Transaction History**: Track all payments with timestamps and transaction IDs.
- **EMI Status Tracking**: Dynamic calculation of whether the current month's EMI is PAID or PENDING.
- **Production-Ready Security**: Rate limiting, XSS protection, helmet headers, and CORS configuration.

## Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL
- **ORM**: Sequelize
- **Validation**: Zod
- **Process Manager**: PM2
- **Reverse Proxy**: Nginx

## Folder Structure
```text
backend/
├── src/
│   ├── config/       # Database and environment configurations
│   ├── controllers/  # Route handlers and business logic
│   ├── middlewares/  # Express middlewares (error handling, security, validation)
│   ├── models/       # Sequelize database models (Customer, Payment)
│   ├── routes/       # Express route definitions
│   ├── services/     # Core business logic and database interactions
│   ├── utils/        # Utility classes (AppError, catchAsync)
│   ├── validators/   # Zod validation schemas
│   ├── app.ts        # Express app initialization
│   └── server.ts     # Application entry point
├── deployment/       # Nginx configurations
├── ecosystem.config.js # PM2 configuration
└── tsconfig.json     # TypeScript configuration
```

## Architecture
```
Internet -> DuckDNS -> Nginx (Reverse Proxy) -> PM2 -> Node.js Express API -> MySQL
```

## Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_pass
DB_NAME=payment_collection
```

## Database Setup
1. Ensure MySQL is running locally or on RDS.
2. Create the database: `CREATE DATABASE payment_collection;`
3. The Sequelize models will automatically synchronize and create the tables (`customers`, `payments`) on server start.

## Local Development Setup
```bash
npm install
npm run dev
```

## Build Commands
```bash
npm run build
```

## Run Commands (Production)
```bash
pm2 start ecosystem.config.js
```

## API Endpoints
- `GET /api/customers` - List all customers
- `GET /api/customers/:accountNumber` - Get customer loan details
- `POST /api/payments` - Make an EMI payment
- `GET /api/payments/:accountNumber` - Get payment history

## Validation Rules
- Account numbers must be string, alphanumeric.
- Payment amounts must be positive numbers and cannot exceed the `remaining_balance`.
- All requests are validated strictly via `zod` middleware.

## Security Features
- **Helmet**: Secures Express apps by setting various HTTP headers.
- **Express Rate Limit**: Prevents DDoS and brute-force attacks by limiting repeated requests.
- **CORS**: Configured to restrict cross-origin requests.
- **XSS-Clean**: Sanitizes user input to prevent Cross-Site Scripting.

## Error Handling
Global centralized error handling middleware (`errorHandler.ts`) catches all asynchronous errors and returns a standardized JSON response:
```json
{
  "status": "error",
  "message": "Error description"
}
```

## PM2 Usage
Managed via `ecosystem.config.js` to ensure 99.9% uptime, utilizing cluster mode and automatic restarts on crash.

## Deployment Steps
Detailed in `DEPLOYMENT.md`. Deployed to AWS EC2 Ubuntu 22.04.

## GitHub Actions CI/CD
Triggered on push to the `main` branch. See `.github/workflows/deploy.yml`.

## Troubleshooting
- **Database Connection Error**: Verify `.env` credentials and ensure MySQL is running.
- **Port Conflict**: Ensure port 5000 is not blocked by another process.
