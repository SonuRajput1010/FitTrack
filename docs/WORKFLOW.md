# 🔄 System Workflow

## Overview

FitTrack follows a **Microservices Architecture** where each service is responsible for a single business capability.

The services communicate using:

- REST APIs
- RabbitMQ (Asynchronous Messaging)
- Eureka Service Discovery

This document explains how data flows through the system.

---

# Complete System Flow

```
                   React Frontend
                         │
                         ▼
                  API Gateway (8080)
                         │
      ┌──────────────────┼──────────────────┐
      ▼                  ▼                  ▼
User Service      Activity Service     AI Fitness Service
(PostgreSQL)        (MongoDB)             (MongoDB)
      │                  │                    ▲
      │                  ▼                    │
      │             RabbitMQ ─────────────────┘
      │
      ▼
 Keycloak Authentication

Config Server
        │
        ▼
All Services

Eureka Server
        │
        ▼
Service Discovery
```

---

# 1️⃣ User Authentication Flow

The application uses **Keycloak** as the Identity Provider.

```
User

↓

React Frontend

↓

Keycloak Login Page

↓

User Authentication

↓

JWT Access Token

↓

React Stores Token

↓

API Gateway

↓

JWT Validation

↓

Forward Request
```

---

# 2️⃣ Automatic User Synchronization

When a user logs in for the first time:

```
Keycloak

↓

Gateway

↓

Extract JWT Claims

↓

Check User Service

↓

User Exists?

      │
 ┌────┴─────┐
 │          │
Yes         No
 │          │
 │          ▼
 │    Register User
 │          │
 └──────────┘
```

The Gateway automatically creates the user profile if it doesn't already exist.

---

# 3️⃣ User Profile Flow

```
Frontend

↓

Gateway

↓

User Service

↓

PostgreSQL

↓

Response

↓

Frontend
```

Supported operations:

- Register User
- Get Profile
- Update Profile
- Delete Profile

---

# 4️⃣ Activity Creation Flow

When a user records a workout:

```
Frontend

↓

Gateway

↓

Activity Service

↓

Validate User

↓

MongoDB

↓

Publish Event

↓

RabbitMQ
```

The Activity Service immediately responds to the user without waiting for AI processing.

---

# 5️⃣ AI Recommendation Flow

RabbitMQ enables asynchronous processing.

```
RabbitMQ

↓

AI Fitness Service

↓

Consume Activity Event

↓

Generate Prompt

↓

Google Gemini AI

↓

Receive AI Response

↓

Process Recommendation

↓

Store Recommendation

↓

MongoDB
```

This keeps the application responsive while AI processing happens in the background.

---

# 6️⃣ Recommendation Retrieval Flow

```
Frontend

↓

Gateway

↓

AI Fitness Service

↓

MongoDB

↓

Recommendation

↓

Frontend
```

---

# 7️⃣ Activity Update Flow

```
Frontend

↓

Gateway

↓

Activity Service

↓

MongoDB Update

↓

RabbitMQ Event

↓

AI Service

↓

Generate New Recommendation

↓

Update MongoDB
```

Whenever an activity changes, the recommendation is regenerated automatically.

---

# 8️⃣ Activity Deletion Flow

```
Frontend

↓

Gateway

↓

Activity Service

↓

Delete Recommendation

↓

AI Service

↓

Delete Activity

↓

MongoDB
```

This ensures recommendations remain consistent with activity data.

---

# Request Lifecycle

```
Client

↓

Gateway

↓

Authentication

↓

Business Service

↓

Database

↓

Response
```

---

# Event Lifecycle

```
Activity Created

↓

RabbitMQ

↓

AI Service

↓

Gemini AI

↓

Recommendation Saved
```

---

# Service Responsibilities

## Gateway

- Authentication
- JWT Validation
- Routing
- User Synchronization
- CORS

---

## User Service

- User Management
- Profile Updates
- Validation
- PostgreSQL Storage

---

## Activity Service

- Activity CRUD
- User Validation
- RabbitMQ Publishing
- MongoDB Storage

---

## AI Fitness Service

- RabbitMQ Consumer
- Gemini Integration
- Recommendation Generation
- MongoDB Storage

---

# Design Principles

FitTrack follows several production-ready software engineering principles.

- Single Responsibility Principle
- Microservices Architecture
- Event-Driven Communication
- Asynchronous Processing
- Centralized Configuration
- Service Discovery
- Secure Authentication
- Polyglot Persistence

---

# Benefits

- Scalable Architecture
- Independent Deployments
- Loose Coupling
- Better Fault Isolation
- Easier Maintenance
- Faster Feature Development
- Production-Ready Design