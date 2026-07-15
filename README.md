# 🏋️ FitTrack

### AI-Powered Fitness Tracking Platform

FitTrack is a production-style **Full Stack Fitness Tracking Platform** built using **Spring Boot Microservices**, **React**, **Keycloak**, **RabbitMQ**, **MongoDB**, **PostgreSQL**, and **Google Gemini AI**.

The platform enables users to securely manage their fitness journey by tracking workouts, maintaining personal profiles, and receiving AI-powered workout recommendations through an event-driven microservices architecture.

> 🚧 **Live Demo:** Coming Soon (Railway Deployment)

---

# 🚀 Project Highlights

- 🏗 Spring Boot Microservices Architecture
- 🔐 OAuth2 Authentication with Keycloak
- 🌐 Spring Cloud Gateway
- 🔍 Eureka Service Discovery
- ⚙ Centralized Configuration Server
- 📨 RabbitMQ Event-Driven Communication
- 🤖 Google Gemini AI Integration
- 🗄 PostgreSQL & MongoDB
- 📊 Interactive Dashboard
- 🌙 Responsive Dark Theme UI

---

# 📸 Application Preview

| Login | Dashboard |
|-------|-----------|
| ![](docs/login.png) | ![](docs/dashboard.png) |

| Profile |
|---------|
| ![](docs/profile.png) |

| Activities | AI Recommendations |
|------------|-------------------|
| ![](docs/activities.png) | ![](docs/recommendation.png) |

---

# 🏗 System Architecture

![](docs/architecture.png)

For a detailed explanation of the architecture:

📄 **[Architecture Documentation](docs/ARCHITECTURE.md)**

---

# ✨ Features

## 🔐 Authentication

- OAuth2 Authentication
- Keycloak Integration
- JWT Token Validation
- Protected REST APIs
- Automatic User Registration

---

## 👤 User Management

- Register User
- View Profile
- Update Profile
- Delete Profile
- Fitness Goal Management

---

## 🏃 Activity Tracking

- Add Activity
- Update Activity
- Delete Activity
- View Activity History
- Track Workout Duration
- Track Calories Burned
- Store Workout Metrics

Supported activities include:

- Running
- Walking
- Cycling
- Swimming
- Gym Workout
- Yoga
- Strength Training

---

## 🤖 AI Recommendation Engine

Whenever an activity is created:

1. Activity is stored in MongoDB.
2. Event is published to RabbitMQ.
3. AI Service consumes the event.
4. Google Gemini generates recommendations.
5. Recommendations are stored and displayed to the user.

---

## 📊 Dashboard

The dashboard provides:

- Weekly Activity Summary
- Calories Burned
- Activity Distribution
- AI Recommendations
- Recent Activities

---

## 🎨 Responsive Frontend

Built using:

- React 19
- Material UI
- React Router
- Responsive Design
- Dark Theme

---

# 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| Backend | Spring Boot, Spring Cloud, Spring Security |
| Frontend | React, Vite, Material UI |
| Authentication | Keycloak, OAuth2, JWT |
| Database | PostgreSQL, MongoDB |
| Messaging | RabbitMQ |
| AI | Google Gemini API |
| Build Tools | Maven, npm |

---

# 📂 Project Structure

```text
FitTrack
│
├── configServer/
├── Eureka/
├── gateway/
├── UserService/
├── ActivityService/
├── AI_Fitness_Service/
├── Fitness_Application_Frontend/
│
├── docs/
│   ├── architecture.png
│   ├── login.png
│   ├── dashboard.png
│   ├── profile.png
│   ├── activities.png
│   ├── recommendation.png
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── SETUP.md
│   ├── WORKFLOW.md
│   └── DEPLOYMENT.md
│
├── README.md
├── LICENSE
├── .gitignore
└── .env.example
```

---

# 🚀 Quick Start

## Clone Repository

```bash
git clone https://github.com/SonuRajput1010/FitTrack.git

cd FitTrack
```

## Start Backend Services

| Order | Service |
|------:|----------|
| 1 | Config Server |
| 2 | Eureka Server |
| 3 | User Service |
| 4 | Activity Service |
| 5 | AI Fitness Service |
| 6 | Gateway |

## Start Frontend

```bash
cd Fitness_Application_Frontend

npm install

npm run dev
```

Frontend:

```
http://localhost:5173
```

---
# 📚 Documentation

Detailed project documentation is available in the **docs** directory.

| Document | Description |
|----------|-------------|
| 📄 [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Complete Microservices Architecture |
| 📄 [API.md](docs/API.md) | REST API Reference |
| 📄 [SETUP.md](docs/SETUP.md) | Local Development Setup |
| 📄 [WORKFLOW.md](docs/WORKFLOW.md) | Request & Event Flow |
| 📄 [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deployment Guide |

---

# 🔐 Security

FitTrack follows production-inspired security practices.

Implemented security features include:

- OAuth2 Authentication
- JWT Token Validation
- Keycloak Identity Provider
- Protected REST APIs
- API Gateway Authentication
- Automatic User Synchronization
- Environment Variable Based Secret Management

---

# 🌐 Service Ports

| Service | Port |
|----------|------|
| Config Server | 8888 |
| Eureka Server | 8761 |
| Gateway | 8080 |
| User Service | 8081 |
| Activity Service | 8082 |
| AI Fitness Service | 8083 |
| React Frontend | 5173 |
| Keycloak | 8181 |

---

# 🚀 Deployment

FitTrack is designed to be deployed on modern cloud platforms.

Supported deployment targets include:

- Railway
- Render
- AWS
- Azure
- Google Cloud Platform

Complete deployment instructions are available in:

📄 **[DEPLOYMENT.md](docs/DEPLOYMENT.md)**

---

# ⚙️ Environment Configuration

Each service uses its own environment configuration.

The repository includes only:

```
.env.example
```

No API keys, passwords or secrets are committed.

Refer to:

📄 **[SETUP.md](docs/SETUP.md)**

for complete environment setup.

---

# 📈 Future Improvements

Planned enhancements include:

- Docker Compose
- Kubernetes Deployment
- GitHub Actions CI/CD
- Cloud Deployment
- Monitoring & Logging

---

# 🤝 Contributing

Contributions are welcome.

If you'd like to contribute:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

---

# 👨‍💻 Author

**Sonu Singh Rajput**

Backend Developer | Full Stack Java Developer

📧 **Email**  
sonusinghrajput9189@gmail.com

💻 **GitHub**  
https://github.com/SonuRajput1010

🔗 **LinkedIn**  
https://www.linkedin.com/in/sonu-rajput1012

---

# 📄 License

This project is licensed under the **MIT License**.

See the **LICENSE** file for more information.

---

# ⭐ Support

If you found this project helpful, please consider giving it a **Star ⭐** on GitHub.

It motivates future improvements and helps others discover the project.

---

<p align="center">

**Built with ❤️ using Java, Spring Boot, React, MongoDB, PostgreSQL, RabbitMQ, Keycloak & Google Gemini AI**

</p>
