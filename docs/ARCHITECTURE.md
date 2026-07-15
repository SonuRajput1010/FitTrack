# 🏗 FitTrack Architecture

## Overview

FitTrack follows a **Microservices Architecture** where each service has a single responsibility and communicates through REST APIs and asynchronous messaging.

The system uses **Spring Cloud** for service discovery and centralized configuration, **RabbitMQ** for event-driven communication, and **Keycloak** for authentication.

---

# High-Level Architecture

![Architecture](architecture.png)

---

# System Components

## React Frontend

The frontend is built using:

- React 19
- Vite
- Material UI
- Axios
- React Router

Responsibilities:

- User Authentication
- Dashboard
- Activity Management
- Profile Management
- AI Recommendation Display

---

## API Gateway

Technology:

- Spring Cloud Gateway

Responsibilities:

- Single Entry Point
- JWT Validation
- OAuth2 Resource Server
- Request Routing
- CORS Configuration
- User Synchronization

Routes requests to:

- User Service
- Activity Service
- AI Fitness Service

---

## Config Server

Technology:

- Spring Cloud Config Server

Responsibilities:

- Centralized Configuration
- Environment Management
- Shared Configuration

All backend services fetch configuration during startup.

---

## Eureka Discovery Server

Technology:

- Netflix Eureka

Responsibilities:

- Service Registration
- Service Discovery
- Dynamic Routing

Every microservice registers itself with Eureka.

---

## User Service

Technology:

- Spring Boot
- Spring Data JPA
- PostgreSQL

Responsibilities:

- User Registration
- User Profile
- Profile Update
- User Validation

Database:

PostgreSQL

---

## Activity Service

Technology:

- Spring Boot
- Spring Data MongoDB

Responsibilities:

- Add Activity
- Update Activity
- Delete Activity
- Activity History

Database:

MongoDB

---

## AI Fitness Service

Technology:

- Spring Boot
- MongoDB
- WebClient
- Google Gemini AI

Responsibilities:

- Consume RabbitMQ Events
- Generate AI Recommendations
- Store Recommendations

Database:

MongoDB

---

## RabbitMQ

Acts as the asynchronous communication layer.

Whenever a new activity is created:

Activity Service

↓

RabbitMQ

↓

AI Service

↓

Recommendation Generated

This allows AI processing without blocking the user request.

---

## Keycloak

Authentication Provider

Responsibilities:

- User Login
- JWT Generation
- OAuth2 Authentication
- Identity Management

The Gateway validates every JWT before forwarding requests.

---

# Database Architecture

FitTrack uses **Polyglot Persistence**.

## PostgreSQL

Stores

- Users
- Profile Information

---

## MongoDB

Stores

### Activities

- Workout Data
- Calories
- Duration
- Metrics

### Recommendations

- AI Analysis
- Suggestions
- Safety Tips

---

# Request Flow

## User Login

```
React

↓

Keycloak

↓

JWT

↓

Gateway
```

---

## Activity Creation

```
React

↓

Gateway

↓

Activity Service

↓

MongoDB

↓

RabbitMQ

↓

AI Service

↓

Gemini AI

↓

MongoDB
```

---

## Recommendation Retrieval

```
React

↓

Gateway

↓

AI Service

↓

MongoDB
```

---

# Advantages of the Architecture

✔ Scalable

✔ Independent Services

✔ Event Driven

✔ Secure

✔ Easy Maintenance

✔ Technology Independent

✔ Production Ready

---

# Technologies Used

| Layer | Technology |
|--------|------------|
| Frontend | React |
| Backend | Spring Boot |
| Authentication | Keycloak |
| Gateway | Spring Cloud Gateway |
| Service Discovery | Eureka |
| Configuration | Config Server |
| Messaging | RabbitMQ |
| User Database | PostgreSQL |
| Activity Database | MongoDB |
| AI Database | MongoDB |
| AI | Google Gemini |