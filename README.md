<div align="center">

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&pause=1000&color=E94560&center=true&vCenter=true&width=500&lines=EDU-MANAGE;Learning+Management+System" alt="EDU-MANAGE" />

### A Full-Stack Educational Management System

**Streamlining academic workflows for students, instructors, and administrators — all in one platform.**

<br/>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

<br/>

[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)
[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-orange?style=flat-square)](CONTRIBUTING.md)
[![Stars](https://img.shields.io/github/stars/hamdanparakkal/EDU-MANAGE?style=flat-square&color=yellow)](https://github.com/hamdanparakkal/EDU-MANAGE/stargazers)
[![Forks](https://img.shields.io/github/forks/hamdanparakkal/EDU-MANAGE?style=flat-square&color=blue)](https://github.com/hamdanparakkal/EDU-MANAGE/network/members)

<br/>

[📌 Overview](#-overview) &nbsp;·&nbsp;
[✨ Features](#-features) &nbsp;·&nbsp;
[🛠️ Tech Stack](#%EF%B8%8F-tech-stack) &nbsp;·&nbsp;
[📂 Structure](#-project-structure) &nbsp;·&nbsp;
[🚀 Getting Started](#-getting-started) &nbsp;·&nbsp;
[▶️ Usage](#%EF%B8%8F-usage) &nbsp;·&nbsp;
[🛣️ Roadmap](#%EF%B8%8F-roadmap) &nbsp;·&nbsp;
[🤝 Contributing](#-contributing)

<br/>

</div>

---

## 📌 Overview

**EDU-MANAGE** is a production-ready, role-based Learning Management System (LMS) built on the **MERN stack**. It digitizes and streamlines academic operations — from course creation and enrollment to assignment grading and attendance tracking — within a single cohesive platform.

The system supports **three distinct roles**, each with a purpose-built experience:

<br/>

<div align="center">

| Role | Access Level | Core Capabilities |
|:----:|:------------:|:-----------------|
| 👨‍🎓 **Student** | Standard | Browse & enroll in courses, submit assignments, track grades & attendance |
| 👩‍🏫 **Instructor** | Elevated | Create & manage courses, upload content, grade students, mark attendance |
| 🛠️ **Admin** | Full | Approve users, oversee course catalog, monitor platform activity |

</div>

<br/>

---

## ✨ Features

<details open>
<summary><b>🔐 Authentication & Security</b></summary>
<br/>

- **JWT-based** stateless authentication with token refresh
- **bcrypt** password hashing with configurable salt rounds
- **Role-Based Access Control (RBAC)** — Students, Instructors, and Admins each have scoped permissions
- **Express Validator** for comprehensive server-side input validation

</details>

<details open>
<summary><b>📚 Course Management</b></summary>
<br/>

- Create, update, and delete courses with rich metadata (title, description, schedule, capacity)
- **Admin-driven course approval** workflow before courses go live
- Student enrollment and unenrollment with capacity enforcement

</details>

<details open>
<summary><b>📝 Assignments & Evaluation</b></summary>
<br/>

- Assignment submissions supporting both **file uploads** and **text responses**
- Instructor grading interface with inline feedback
- Student progress tracking dashboard per course

</details>

<details open>
<summary><b>📊 Attendance & Reporting</b></summary>
<br/>

- Per-session attendance marking by instructors
- Student-level and course-level **attendance analytics**
- Exportable attendance summaries

</details>

<details open>
<summary><b>💬 Messaging</b></summary>
<br/>

- **Direct messaging** between students and instructors
- Persistent conversation history
- In-app notification indicators

</details>

<details open>
<summary><b>📁 File Handling</b></summary>
<br/>

- Secure file upload pipeline via **Multer**
- File type and size validation on both client and server
- Organized storage with access control per user role

</details>

<br/>

---

## 🛠️ Tech Stack

<div align="center">

<table>
<tr>
<td valign="top" width="50%">

### 🖥️ Frontend

| Technology | Purpose |
|------------|---------|
| ⚛️ React.js 18 | Component-based UI |
| 🎨 Tailwind CSS | Utility-first styling |
| 🔗 Axios | HTTP client |
| 🧭 React Router v6 | Client-side routing |

</td>
<td valign="top" width="50%">

### ⚙️ Backend

| Technology | Purpose |
|------------|---------|
| 🟢 Node.js + Express.js | REST API server |
| 🍃 MongoDB + Mongoose | Database & ODM |
| 🔑 JSON Web Tokens | Stateless auth |
| 📦 Multer / bcrypt | File uploads & hashing |

</td>
</tr>
</table>

</div>

<br/>

---

## 📂 Project Structure

```
edu-manage/
│
├── backend/
│   ├── models/           # Mongoose schemas (User, Course, Assignment, etc.)
│   ├── routes/           # Express route handlers by resource
│   ├── middleware/        # Auth guards, role checks, error handlers
│   ├── scripts/          # Seed scripts and utilities
│   └── server.js         # App entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route-level page components
│   │   └── App.jsx       # Root component and routing config
│   └── tailwind.config.js
│
└── README.md
```

<br/>

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Download |
|-------------|---------|----------|
| Node.js | v16 or higher | [nodejs.org](https://nodejs.org/) |
| MongoDB | Local or Atlas | [mongodb.com](https://www.mongodb.com/) |
| npm / yarn | Latest | Bundled with Node.js |

<br/>

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

Create a `.env` file inside the `/backend` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:3000
```

> 💡 **Tip:** Use a long, random string for `JWT_SECRET`. You can generate one with `openssl rand -hex 64`.

Start the backend development server:

```bash
npm run dev
```

✅ Backend will be running at `http://localhost:5000`

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

✅ Frontend will be running at `http://localhost:3000`

> ⚠️ **Important:** Ensure your MongoDB instance is running **before** starting the backend server.

<br/>

---

## ▶️ Usage

### 👨‍🎓 Student Flow

```
Register Account
      ↓
Verify Email
      ↓
Login to Dashboard
      ↓
Browse & Enroll in Courses
      ↓
View Course Content
      ↓
Submit Assignments
      ↓
Track Grades & Attendance
```

### 👩‍🏫 Instructor Flow

```
Register Account
      ↓
Await Admin Approval
      ↓
Login to Dashboard
      ↓
Create Course & Upload Content
      ↓
Manage Student Enrollments
      ↓
Grade Submissions & Give Feedback
      ↓
Mark Attendance Per Session
```

### 🛠️ Admin Flow

```
Login to Admin Dashboard
      ↓
Approve / Reject User Accounts
      ↓
Manage Course Catalog
      ↓
Monitor Platform Activity
      ↓
Generate Reports
```

<br/>

---

## 📜 Available Scripts

| Command | Directory | Description |
|---------|-----------|-------------|
| `npm run dev` | `/backend` | Start backend in development mode with **nodemon** |
| `npm start` | `/frontend` | Run the React development server |
| `npm run build` | `/frontend` | Build the frontend for production |

<br/>

---

## 🛣️ Roadmap

Planned features and improvements for future releases:

- [ ] 📧 **Email notifications** — Course updates, grade alerts, and enrollment confirmations
- [ ] 📱 **Full mobile responsiveness** — Optimized experience across all screen sizes
- [ ] ☁️ **Cloud file storage** — AWS S3 or Cloudinary integration
- [ ] 🔐 **Two-factor authentication** — Enhanced account security (TOTP-based 2FA)
- [ ] 📊 **Advanced analytics dashboard** — Charts and insights for instructors and admins
- [ ] 🔔 **Real-time notifications** — WebSocket-powered live updates
- [ ] 🌐 **Multi-language support** — i18n integration for global accessibility
- [ ] 🤖 **AI study recommendations** — Personalized content suggestions for students

<br/>

---

## 🤝 Contributing

Contributions, issues, and feature requests are genuinely welcome!

### How to Contribute

**1.** Fork the repository

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/EDU-MANAGE.git
cd EDU-MANAGE
```

**2.** Create your feature branch

```bash
git checkout -b feature/YourFeatureName
```

**3.** Make your changes and commit using [Conventional Commits](https://www.conventionalcommits.org/)

```bash
git commit -m "feat: add YourFeatureName"
# Other prefixes: fix:, docs:, style:, refactor:, test:, chore:
```

**4.** Push to your branch

```bash
git push origin feature/YourFeatureName
```

**5.** Open a Pull Request — describe your changes clearly and link any related issues.

<br/>

> Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before submitting.

<br/>

---

## 📄 License

This project is distributed under the **MIT License** — see the [LICENSE](LICENSE) file for full details.

```
MIT License — Free to use, modify, and distribute with attribution.
```

<br/>

---

## 👤 Author

<div align="center">

<img src="https://github.com/hamdanparakkal.png" width="100" style="border-radius:50%;" alt="Muhammed Hamdan"/>

### Muhammed Hamdan

[![GitHub](https://img.shields.io/badge/GitHub-@hamdanparakkal-181717?style=for-the-badge&logo=github)](https://github.com/hamdanparakkal)

</div>

<br/>

---

## ⭐ Acknowledgements

- [MERN Stack Documentation](https://www.mongodb.com/mern-stack)
- [Mongoose ODM](https://mongoosejs.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [JWT Authentication Guide](https://jwt.io/)
- [Express.js](https://expressjs.com/)
- [React Documentation](https://react.dev/)

---

<div align="center">

<br/>

**If EDU-MANAGE helped you, please consider giving it a ⭐ — it means a lot!**

<br/>

[![Star this repo](https://img.shields.io/badge/⭐%20Star%20this%20repo-yellow?style=for-the-badge)](https://github.com/hamdanparakkal/EDU-MANAGE)

<br/>

*Made with ❤️ by [Muhammed Hamdan](https://github.com/hamdanparakkal)*

</div>
