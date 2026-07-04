# Payment Collection Application (Backend)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)

A robust, highly secure, and highly scalable RESTful API built to manage customer loan accounts and process EMI payments. This repository contains the **Backend** service, built using Node.js, Express, TypeScript, and MySQL.

## 🚀 Live API Base URL
- **Production Endpoint**: `http://pay-app.duckdns.org/api`

## 📑 Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Architecture & Folder Structure](#architecture--folder-structure)
5. [Local Setup Instructions](#local-setup-instructions)
6. [Environment Configuration](#environment-configuration)
7. [Security & Validation](#security--validation)
8. [Deployment (CI/CD)](#deployment-cicd)
9. [Detailed Documentation](#detailed-documentation)

---

## 🎯 Project Overview
The backend acts as the core engine for the Payment Collection System. It handles all critical business logic, including:
- Providing detailed customer and loan data.
- Processing secure EMI transactions.
- Dynamically recalculating remaining balances.
- Storing and retrieving immutable transaction histories.

---

## ✨ Key Features
- **Type-Safe Architecture**: 100% written in TypeScript to guarantee compile-time safety and eliminate runtime type errors.
- **Production-Ready Security**: Implements Helmet, express-rate-limit, strict CORS policies, and XSS sanitization.
- **Relational Integrity**: Uses MySQL with Sequelize ORM for strict schema definitions, migrations, and ACID-compliant transactions.
- **Robust Validation**: Utilizes Zod for strict schema parsing on all incoming payloads (e.g., preventing negative payments or overpayments).
- **Centralized Error Handling**: A unified global error interceptor that guarantees predictable, sanitized JSON error responses without leaking stack traces.

---

## 🛠 Technology Stack
| Category | Technology |
|---|---|
| **Runtime** | Node.js (v20) |
| **Framework** | Express.js |
| **Language** | TypeScript |
| **Database** | MySQL |
| **ORM** | Sequelize |
| **Process Manager** | PM2 |
| **Reverse Proxy** | Nginx |

---

## 📂 Architecture & Folder Structure

```text
backend/
├── src/
│   ├── config/           # Environment variables and database connections
│   ├── controllers/      # Route controllers containing business logic
│   ├── middlewares/      # Global middlewares (Security, Validation, Errors)
│   ├── models/           # Sequelize ORM schema definitions (Customer, Payment)
│   ├── routes/           # Express API route mapping
│   ├── services/         # Core database transaction logic
│   ├── utils/            # Utility helpers (AppError, catchAsync)
│   ├── validators/       # Zod schemas for payload validation
│   ├── app.ts            # Express application initialization
│   └── server.ts         # Server entry point and database synchronizer
├── deployment/           # Nginx configuration templates
├── ecosystem.config.js   # PM2 clustering configuration
├── tsconfig.json         # TypeScript compiler configuration
└── package.json          # Node dependencies and scripts
```

---

## 💻 Local Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MySQL Server (running locally or via Docker)

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Athul666MS/payment-collection-backend.git
   cd payment-collection-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   *(The server will use `ts-node-dev` for hot-reloading).*

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory. The application relies on these variables to connect to the database securely.

```env
# Application configuration
PORT=5000
NODE_ENV=development

# Database configuration
DB_HOST=localhost
DB_USER=your_db_username
DB_PASS=your_db_password
DB_NAME=payment_collection
```

---

## 🛡️ Security & Validation

We take security seriously. The API is fortified with:
- **Helmet**: Sets 14+ secure HTTP headers by default.
- **Rate Limiting**: Limits endpoints to a maximum of 100 requests per 15 minutes per IP to prevent brute-forcing.
- **XSS Protection**: Cleans user input to prevent Cross-Site Scripting.
- **Zod Validation**: Prevents malicious or malformed JSON payloads from reaching the controllers.

---

## 🚀 Deployment (CI/CD)

The backend is deployed to an **AWS EC2 Ubuntu** instance. 

- **Process Management**: We use **PM2** to run the Node app in cluster mode, ensuring automatic restarts on crashes and zero-downtime reloads.
- **Reverse Proxy**: **Nginx** acts as a reverse proxy, listening on port 80 and forwarding requests to the Node server on port 5000.
- **Continuous Deployment**: The entire build and deployment flow is automated via **GitHub Actions** (`.github/workflows/deploy.yml`). Pushing to `main` automatically builds the TypeScript files and restarts the PM2 process on the EC2 server securely via SSH.

---

## 📖 Detailed Documentation

For an in-depth look at our architecture and API endpoints, please refer to the following documents included in this repository:

- [API Documentation (API_DOCUMENTATION.md)](./API_DOCUMENTATION.md) - Full specification of all routes, request payloads, and response formats.
- [Deployment Guide (DEPLOYMENT.md)](./DEPLOYMENT.md) - Step-by-step instructions for provisioning the EC2 server, installing Nginx/PM2, and configuring MySQL.
- [CI/CD Pipeline (CI_CD.md)](./CI_CD.md) - Architectural flow diagram and explanation of our GitHub Actions integration.
