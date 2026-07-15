# 🚀 Deployment Guide

## Overview

FitTrack is designed using a production-style microservices architecture and can be deployed on various cloud platforms.

Supported deployment platforms include:

- Railway
- Render
- AWS
- Azure
- Google Cloud Platform

---

# Deployment Architecture

```
                    Internet
                        │
                        ▼
                 React Frontend
                        │
                        ▼
                  API Gateway
                        │
      ┌─────────────────┼──────────────────┐
      ▼                 ▼                  ▼
 User Service     Activity Service    AI Fitness Service
(PostgreSQL)       (MongoDB)            (MongoDB)
      │                 │                   ▲
      │                 ▼                   │
      │             RabbitMQ ───────────────┘
      │
      ▼
 Keycloak Authentication

 Config Server

 Eureka Server
```

---

# Deployment Options

## Option 1 — Railway (Recommended)

Railway provides an easy way to deploy microservices with managed databases.

Suitable for:

- Portfolio Projects
- Personal Projects
- Demonstrations

Services to deploy:

- Config Server
- Eureka Server
- Gateway
- User Service
- Activity Service
- AI Fitness Service
- React Frontend

---

## Option 2 — Render

Render supports Spring Boot services and static frontend hosting.

Suitable for:

- Portfolio Projects
- Small Applications

---

## Option 3 — AWS

Recommended for production environments.

Possible AWS services:

- ECS
- EC2
- RDS
- DocumentDB
- Amazon MQ
- Application Load Balancer
- Route53
- CloudWatch

---

# Environment Variables

Each service uses its own `.env` file.

Never commit:

- API Keys
- Database Passwords
- JWT Secrets
- Access Tokens

Only commit:

```
.env.example
```

---

# Databases

## PostgreSQL

Stores:

- Users
- Profile Information

---

## MongoDB

Stores:

- Activities
- AI Recommendations

---

# RabbitMQ

RabbitMQ enables asynchronous communication between services.

Workflow:

```
Activity Service

↓

RabbitMQ

↓

AI Fitness Service
```

---

# Google Gemini

The AI Fitness Service communicates with Google Gemini using the Gemini API.

Configuration:

```
GEMINI_API_KEY
```

stored inside the environment file.

---

# Deployment Checklist

Before deploying, ensure the following:

- Config Server is running
- Eureka Server is running
- PostgreSQL is configured
- MongoDB is configured
- RabbitMQ is configured
- Keycloak Realm is exported
- Gemini API Key is configured
- Environment variables are updated
- Frontend API URL points to the deployed Gateway

---

# Production Improvements

Future enhancements include:

- Docker Compose
- Kubernetes
- GitHub Actions CI/CD
- HTTPS
- Custom Domain
- SSL Certificates
- Centralized Logging
- Monitoring with Prometheus
- Grafana Dashboards
- Distributed Tracing

---

# Deployment Status

| Component | Status |
|-----------|--------|
| Backend Services | ✅ Ready |
| Frontend | ✅ Ready |
| API Gateway | ✅ Ready |
| Keycloak Integration | ✅ Ready |
| RabbitMQ | ✅ Ready |
| AI Recommendation Engine | ✅ Ready |
| Environment Variables | ✅ Ready |
| GitHub Repository | ✅ Ready |
| Railway Deployment | ⏳ Planned |
| AWS Deployment | ⏳ Planned |

---

# Next Steps

1. Push the project to GitHub.
2. Deploy backend services.
3. Deploy the React frontend.
4. Configure environment variables.
5. Verify all services are healthy.
6. Capture screenshots.
7. Add the live application URL to the README.

---

# Conclusion

FitTrack has been structured as a production-style microservices application following modern software engineering practices.

Its architecture demonstrates:

- Microservices
- Event-Driven Communication
- OAuth2 Authentication
- Service Discovery
- Centralized Configuration
- Polyglot Persistence
- AI Integration
- Scalable Design

making it a strong portfolio project for Full Stack Java Developer and SDE roles.