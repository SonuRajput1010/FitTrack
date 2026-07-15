# 📡 API Reference

## Overview

FitTrack follows a RESTful microservices architecture.

All client requests are routed through the **API Gateway**, which authenticates users using Keycloak and forwards requests to the appropriate microservice.

---

# Base URL

```
http://localhost:8080
```

After deployment:

```
https://your-domain.com
```

---

# Authentication

All protected APIs require a valid JWT Access Token.

Example

```
Authorization: Bearer <access_token>
```

---

# User Service

Base Path

```
/api/users
```

## Register User

```http
POST /api/users/register
```

Registers a new user after successful Keycloak authentication.

---

## Get User Profile

```http
GET /api/users/{userId}
```

Returns user profile details.

---

## Get All Users

```http
GET /api/users
```

Returns all registered users.

---

## Update User

```http
PUT /api/users/{userId}
```

Updates the complete user profile.

---

## Partially Update User

```http
PATCH /api/users/{userId}
```

Updates selected user fields.

---

## Delete User

```http
DELETE /api/users/{userId}
```

Deletes the user profile.

---

## Validate User

```http
GET /api/users/{userId}/validate
```

Used internally by other microservices.

---

# Activity Service

Base Path

```
/api/activities
```

---

## Create Activity

```http
POST /api/activities
```

Creates a new fitness activity.

Headers

```
X-USER-ID
```

---

## Get User Activities

```http
GET /api/activities
```

Returns all activities of the authenticated user.

---

## Get Activity

```http
GET /api/activities/{activityId}
```

Returns activity details.

---

## Update Activity

```http
PUT /api/activities/{activityId}
```

Updates an activity.

---

## Delete Activity

```http
DELETE /api/activities/{activityId}
```

Deletes an activity and its associated AI recommendation.

---

## Get All Activities

```http
GET /api/activities/allActivities
```

Returns every activity stored in MongoDB.

---

## Regenerate Recommendation

```http
POST /api/activities/{activityId}/regenerate-recommendation
```

Triggers AI recommendation generation again.

---

# AI Recommendation Service

Base Path

```
/api/recommendations
```

---

## Get User Recommendations

```http
GET /api/recommendations/user/{userId}
```

Returns all recommendations for a user.

---

## Get Recommendation

```http
GET /api/recommendations/activity/{activityId}
```

Returns the recommendation for a specific activity.

---

## Delete Recommendation

```http
DELETE /api/recommendations/activity/{activityId}
```

Deletes the recommendation associated with an activity.

---

# HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

# Authentication Flow

```
Client

↓

Keycloak Login

↓

Access Token

↓

API Gateway

↓

Microservice
```

---

# Event-Driven Communication

Whenever an activity is created or updated:

```
Activity Service

↓

RabbitMQ

↓

AI Fitness Service

↓

Google Gemini AI

↓

Recommendation Stored
```

---

# Notes

- All APIs are exposed through the API Gateway.
- Services communicate internally using Eureka Service Discovery.
- Sensitive configuration is managed using environment variables.
- JWT authentication is enforced by the Gateway.