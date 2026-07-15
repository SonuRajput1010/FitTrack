# ⚙️ Local Setup Guide

This guide explains how to run the FitTrack project on your local machine.

---

# Prerequisites

Install the following software before starting the project.

| Software | Version |
|----------|---------|
| Java | 21+ |
| Maven | Latest |
| Node.js | 20+ |
| PostgreSQL | Latest |
| MongoDB | Latest |
| RabbitMQ | Latest |
| Keycloak | Latest |
| Git | Latest |

---

# Clone Repository

```bash
git clone https://github.com/SonuRajput1010/FitTrack.git

cd FitTrack
```

---

# Project Structure

```
FitTrack
│
├── configServer
├── Eureka
├── gateway
├── UserService
├── ActivityService
├── AI_Fitness_Service
└── Fitness_Application_Frontend
```

---

# Configure Environment Variables

Each backend service contains its own `.env` file.

Example

```properties
SERVER_PORT=8081

EUREKA_SERVER_URL=http://localhost:8761/eureka/
```

Never commit actual secrets.

Use the provided

```
.env.example
```

as a reference.

---

# Required Services

Before starting the backend, make sure the following services are running.

- PostgreSQL
- MongoDB
- RabbitMQ
- Keycloak

---

# Start Backend Services

Run the services in the following order.

## 1. Config Server

```
Port: 8888
```

↓

## 2. Eureka Server

```
Port: 8761
```

↓

## 3. User Service

```
Port: 8081
```

↓

## 4. Activity Service

```
Port: 8082
```

↓

## 5. AI Fitness Service

```
Port: 8083
```

↓

## 6. Gateway

```
Port: 8080
```

---

# Start Frontend

Navigate to the frontend directory.

```bash
cd Fitness_Application_Frontend
```

Install dependencies.

```bash
npm install
```

Start the development server.

```bash
npm run dev
```

Application

```
http://localhost:5173
```

---

# Verify Services

| Service | URL |
|----------|-----|
| Config Server | http://localhost:8888 |
| Eureka Dashboard | http://localhost:8761 |
| Gateway | http://localhost:8080 |
| Frontend | http://localhost:5173 |
| Keycloak | http://localhost:8181 |

---

# Authentication

The application uses **Keycloak** for authentication.

1. Login using Keycloak.
2. Receive a JWT Access Token.
3. The Gateway validates the token.
4. Requests are routed to the appropriate service.

---

# Databases

## PostgreSQL

Stores

- User Information
- Profile Data

---

## MongoDB

Stores

- Activities
- AI Recommendations

---

# Messaging

RabbitMQ is used for asynchronous communication.

Whenever an activity is created or updated:

```
Activity Service

↓

RabbitMQ

↓

AI Fitness Service
```

---

# Troubleshooting

## Service not registering

Check

- Config Server
- Eureka Server
- `.env` configuration

---

## MongoDB connection failed

Verify

- MongoDB is running
- Database URI is correct

---

## RabbitMQ connection failed

Verify

- RabbitMQ server is running
- Username and password are correct

---

## Keycloak authentication failed

Verify

- Realm configuration
- Client ID
- Redirect URI
- JWT configuration

---

# Ready to Use

Once all services are running successfully, open:

```
http://localhost:5173
```

Login with Keycloak and start using FitTrack.