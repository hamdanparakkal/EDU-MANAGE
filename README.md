<div align="center">

<br/>

# 🎓 EDU-MANAGE

### A Full-Stack Educational Management System

**Streamlining academic workflows for students, instructors, and administrators — all in one platform.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg)](https://mongodb.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Features](#-features) · [Tech Stack](#%EF%B8%8F-tech-stack) · [Getting Started](#-getting-started) · [Usage](#-usage) · [Roadmap](#%EF%B8%8F-roadmap) · [Contributing](#-contributing)

<br/>

</div>

---

## 📌 Overview

**EDU-MANAGE** is a feature-rich, role-based Learning Management System (LMS) built on the MERN stack. It digitizes and streamlines academic operations — from course creation and enrollment to assignment grading and attendance tracking — within a single cohesive platform.

The system supports three distinct roles, each with a tailored experience:

| Role | Description |
|------|-------------|
| 👨‍🎓 **Student** | Browse and enroll in courses, submit assignments, track grades and attendance |
| 👩‍🏫 **Instructor** | Create and manage courses, upload content, evaluate and grade students |
| 🛠️ **Admin** | Approve users, oversee course catalog, monitor platform activity |

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based stateless authentication
- Password hashing with **bcrypt**
- Role-based access control (RBAC) for Students, Instructors, and Admins
- Input validation via **Express Validator**

### 📚 Course Management
- Create, update, and delete courses with rich metadata
- Admin-driven course approval workflow
- Student enrollment and unenrollment management

### 📝 Assignments & Evaluation
- Assignment submission supporting both file uploads and text responses
- Grading system with instructor feedback
- Student progress tracking per course

### 📊 Attendance & Reporting
- Attendance marking per session
- Per-student and per-course attendance analytics

### 💬 Messaging
- Direct messaging between students and instructors
- Conversation history and notifications

### 📁 File Handling
- Secure file upload via **Multer**
- File type and size validation
- Organized file storage with access control

---

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="50%">

**Frontend**
- ⚛️ React.js 18
- 🎨 Tailwind CSS
- 🔗 Axios
- 🧭 React Router v6

</td>
<td valign="top" width="50%">

**Backend**
- 🟢 Node.js + Express.js
- 🍃 MongoDB + Mongoose
- 🔑 JSON Web Tokens (JWT)
- 📦 Multer, bcrypt, Express Validator

</td>
</tr>
</table>

---

## 📂 Project Structure

```
edu-manage/
├── backend/
│   ├── models/          # Mongoose schemas (User, Course, Assignment, etc.)
│   ├── routes/          # Express route handlers by resource
│   ├── middleware/       # Auth guards, role checks, error handlers
│   ├── scripts/         # Seed scripts and utilities
│   └── server.js        # App entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route-level page components
│   │   └── App.jsx      # Root component and routing
│   └── tailwind.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) v16 or higher
- [MongoDB](https://www.mongodb.com/) (local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- npm or yarn

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/hamdanparakkal/EDU-MANAGE.git
cd EDU-MANAGE
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `/backend` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:3000
```

Start the development server:

```bash
npm run dev
```

The backend will be running at `http://localhost:5000`.

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

The frontend will be running at `http://localhost:3000`.

> ⚠️ **Note:** Ensure your MongoDB instance is running before starting the backend server.

---

## ▶️ Usage

### 👨‍🎓 Student Flow

```
Register → Verify Email → Login → Browse Courses → Enroll
    → View Content → Submit Assignments → Track Grades & Attendance
```

### 👩‍🏫 Instructor Flow

```
Register → Admin Approval → Login → Create Course → Upload Content
    → Manage Enrollments → Grade Assignments → Mark Attendance
```

### 🛠️ Admin Flow

```
Login → Approve/Reject Users → Manage Course Catalog
    → Monitor Platform Activity → Generate Reports
```

---

## 📜 Scripts

| Command | Directory | Description |
|---------|-----------|-------------|
| `npm run dev` | `/backend` | Start backend in development mode (nodemon) |
| `npm start` | `/frontend` | Run the React development server |
| `npm run build` | `/frontend` | Build the frontend for production |

---

## 🛣️ Roadmap

Planned improvements for future releases:

- [ ] 📧 Email notifications (course updates, grade alerts)
- [ ] 📱 Full mobile responsiveness
- [ ] ☁️ Cloud file storage via AWS S3 or Cloudinary
- [ ] 🔐 Two-factor authentication (2FA)
- [ ] 📊 Advanced analytics dashboard with charts
- [ ] 🔔 Real-time notifications using WebSockets
- [ ] 🌐 Multi-language support (i18n)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the repository
2. **Create** your feature branch:
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. **Commit** your changes:
   ```bash
   git commit -m "feat: add YourFeatureName"
   ```
4. **Push** to your branch:
   ```bash
   git push origin feature/YourFeatureName
   ```
5. **Open** a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

**Muhammed Hamdan**

- GitHub: [@hamdanparakkal](https://github.com/hamdanparakkal)

---

## ⭐ Acknowledgements

- [MERN Stack Documentation](https://www.mongodb.com/mern-stack)
- [MongoDB & Mongoose Docs](https://mongoosejs.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [JWT Authentication](https://jwt.io/)
- [Express.js](https://expressjs.com/)

---

<div align="center">

**If you found this project useful, please consider giving it a ⭐ on GitHub!**

</div>
