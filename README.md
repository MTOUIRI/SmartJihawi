# SmartJihawi (SmartBac) 🎓

> Full-stack educational platform helping Moroccan students prepare for French regional exams

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://smartbac.com)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)

## 🌐 Live Application

**Visit:** [smartbac.com](https://smartbac.com)

Currently serving Moroccan students in production with interactive lessons, exercises, and progress tracking.

## 🚀 Features

- ✅ **Secure Authentication** - JWT-based authentication with role-based access control (Student/Admin)
- ✅ **Lesson Management** - Comprehensive system for creating and organizing educational content
- ✅ **Interactive Exercises** - Practice questions and exam models for French regional exams
- ✅ **Progress Tracking** - Student dashboard showing performance and completion rates
- ✅ **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- ✅ **Real-time Updates** - Dynamic content delivery and instant feedback

## 🛠️ Tech Stack

### Backend
- **Spring Boot 3.x** - RESTful API architecture
- **Spring Security** - JWT authentication & authorization
- **JPA/Hibernate** - Database ORM
- **MySQL** - Relational database
- **Maven** - Dependency management

### Frontend
- **React.js 18** - Component-based UI
- **JavaScript (ES6+)** - Modern JavaScript features
- **CSS3** - Responsive styling
- **Axios** - HTTP client for API calls

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy (production)
- **SSL/HTTPS** - Secure communications

## 📁 Project Structure
```
SmartJihawi/
├── backend/          # Spring Boot application
│   ├── src/
│   └── pom.xml
├── frontend/         # React application
│   ├── src/
│   └── package.json
├── docker-compose.yml      # Production Docker setup
├── docker-compose.dev.yml  # Development Docker setup
└── exams_db.sql           # Database schema
```

## 🏃 Quick Start

### Prerequisites
- Java 17+
- Node.js 16+
- MySQL 8.0+
- Docker & Docker Compose (optional)

### Option 1: Docker (Recommended)
```bash
# Clone the repository
git clone https://github.com/MTOUIRI/SmartJihawi.git
cd SmartJihawi

# Start with Docker Compose
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
```

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
# Configure application.properties with your MySQL credentials
mvn clean install
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

**Database:**
```bash
mysql -u root -p < exams_db.sql
```

## 🔐 Environment Variables

Create `.env` files (not tracked in Git):

**Backend (.env):**
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=smartbac
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:8080/api
```

## 📊 Database Schema

The database includes tables for:
- Users (students & admins)
- Lessons & chapters
- Exercises & questions
- Student progress & scores
- Exam models

See `exams_db.sql` for complete schema.

## 🎯 Key Technical Achievements

- **JWT Authentication** - Secure token-based auth with refresh tokens
- **Role-Based Access Control** - Different permissions for students vs admins
- **RESTful API Design** - Clean, documented endpoints
- **Responsive UI** - Mobile-first design approach
- **Docker Deployment** - Containerized for easy scaling
- **SSL/HTTPS** - Secure production deployment

## 📸 Screenshots

_Coming soon - Add screenshots of your application here_

## 🤝 Contributing

This is a production application. For bug reports or feature requests, please open an issue.

## 👨‍💻 Author

**Mouad Touiri**
- LinkedIn: [your-linkedin-url]
- Email: mouad.touiri@gmail.com
- Portfolio: [your-portfolio-url]

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

⭐ If you find this project helpful, please consider giving it a star!

**Note:** This is a production application currently serving real students preparing for their exams.
```

### Step 2: Add Repository Description (30 seconds)

Go to your repo settings and add this description:
```
Full-stack educational platform (Spring Boot + React) serving Moroccan students - JWT auth, Docker, MySQL | Live: smartbac.com
```

### Step 3: Add Topics/Tags (1 minute)

Add these topics to your repo:
- `spring-boot`
- `react`
- `jwt-authentication`
- `mysql`
- `docker`
- `education`
- `fullstack`
- `morocco`
- `rest-api`
- `docker-compose`

### Step 4: Add LICENSE file (2 minutes)

Create `LICENSE` file:
```
MIT License

Copyright (c) 2025 Mouad Touiri

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

[rest of MIT license text]
