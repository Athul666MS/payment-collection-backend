# API Documentation

Base URL: `http://pay-app.duckdns.org/api`

## 1. Get All Customers
- **Endpoint**: `/customers`
- **Method**: `GET`
- **Purpose**: Retrieves a list of all registered customers and their loan details.
- **Request Parameters**: None
- **Validation Rules**: None

### Success Response
- **Status Code**: `200 OK`
```json
{
  "status": "success",
  "data": {
    "customers": [
      {
        "id": 1,
        "account_number": "ACC1001",
        "name": "Athul Sivanand",
        "total_loan": 500000,
        "remaining_balance": 450000,
        "emi_amount": 10000,
        "created_at": "2026-07-04T10:00:00Z"
      }
    ]
  }
}
```

### Error Response
- **Status Code**: `500 Internal Server Error` (Database unreachable)

---

## 2. Get Customer by Account Number
- **Endpoint**: `/customers/:accountNumber`
- **Method**: `GET`
- **Purpose**: Retrieves loan details for a specific customer.
- **Request Parameters**: 
  - `accountNumber` (URL Parameter) - Alphanumeric account identifier.
- **Validation Rules**: 
  - `accountNumber` must be a non-empty string.

### Request Example
```bash
curl http://pay-app.duckdns.org/api/customers/ACC1001
```

### Success Response
- **Status Code**: `200 OK`
```json
{
  "status": "success",
  "data": {
    "customer": {
      "id": 1,
      "account_number": "ACC1001",
      "name": "Athul Sivanand",
      "total_loan": 500000,
      "remaining_balance": 450000,
      "emi_amount": 10000,
      "created_at": "2026-07-04T10:00:00Z"
    }
  }
}
```

### Error Responses
- **Status Code**: `404 Not Found` (Customer does not exist)
- **Status Code**: `400 Bad Request` (Invalid parameters)

---

## 3. Make an EMI Payment
- **Endpoint**: `/payments`
- **Method**: `POST`
- **Purpose**: Processes a payment for a specific account, deducts the amount from the `remaining_balance`, and creates a transaction receipt.
- **Request Parameters** (JSON Body):
  - `accountNumber` (String) - Customer's account number.
  - `amount` (Number) - The payment amount.
- **Validation Rules**:
  - `accountNumber` must be a non-empty string.
  - `amount` must be a positive number greater than 0.
  - `amount` cannot exceed the customer's `remaining_balance`.

### Request Example
```json
{
  "accountNumber": "ACC1001",
  "amount": 10000
}
```

### Success Response
- **Status Code**: `201 Created`
```json
{
  "status": "success",
  "data": {
    "receipt": {
      "transaction_id": "TXN_8fa4d92",
      "account_number": "ACC1001",
      "amount": 10000,
      "date": "2026-07-04T10:30:00Z",
      "remaining_balance": 440000
    }
  }
}
```

### Error Responses
- **Status Code**: `404 Not Found` (Customer does not exist)
- **Status Code**: `400 Bad Request` (Payment exceeds remaining balance)
- **Status Code**: `400 Bad Request` (Validation error on amount or account number)

---

## 4. Get Payment History
- **Endpoint**: `/payments/:accountNumber`
- **Method**: `GET`
- **Purpose**: Retrieves the chronological payment history for a specific customer.
- **Request Parameters**:
  - `accountNumber` (URL Parameter) - Alphanumeric account identifier.
- **Validation Rules**:
  - `accountNumber` must be a non-empty string.

### Request Example
```bash
curl http://pay-app.duckdns.org/api/payments/ACC1001
```

### Success Response
- **Status Code**: `200 OK`
```json
{
  "status": "success",
  "data": {
    "history": [
      {
        "id": 1,
        "transaction_id": "TXN_8fa4d92",
        "customer_id": 1,
        "amount": 10000,
        "payment_date": "2026-07-04T10:30:00Z"
      }
    ]
  }
}
```

### Error Responses
- **Status Code**: `404 Not Found` (Customer does not exist)
- **Status Code**: `400 Bad Request` (Invalid parameters)
