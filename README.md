<div align="center">

  <!-- Lightweight inline SVG with a 3D isometric cube and gradient title -->
  <svg width="920" height="180" viewBox="0 0 920 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Maxxie Fitness Center Management System">
    <defs>
      <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#7C3AED"/>
        <stop offset="50%" stop-color="#2563EB"/>
        <stop offset="100%" stop-color="#06B6D4"/>
      </linearGradient>
      <linearGradient id="g2" x1="0" x2="1" y1="1" y2="0">
        <stop offset="0%" stop-color="#0EA5E9"/>
        <stop offset="100%" stop-color="#22D3EE"/>
      </linearGradient>
      <linearGradient id="textGrad" x1="0" x2="1">
        <stop offset="0%" stop-color="#22D3EE"/>
        <stop offset="50%" stop-color="#60A5FA"/>
        <stop offset="100%" stop-color="#A78BFA"/>
      </linearGradient>
      <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="12" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.25"/>
      </filter>
    </defs>
    <g transform="translate(40,30)">
      <!-- Isometric cube -->
      <g transform="translate(0,0) scale(1.2)" filter="url(#softShadow)">
        <polygon points="40,10 100,40 60,70 0,40" fill="url(#g1)"/>
        <polygon points="0,40 60,70 60,120 0,90" fill="#164E63" opacity="0.8"/>
        <polygon points="100,40 60,70 60,120 100,90" fill="url(#g2)"/>
      </g>
      <!-- Title -->
      <text x="170" y="55" font-family="Segoe UI, Inter, system-ui, -apple-system, Arial" font-size="28" font-weight="800" fill="url(#textGrad)">Maxxie Fitness Center Management System</text>
      <text x="170" y="90" font-family="Segoe UI, Inter, system-ui, -apple-system, Arial" font-size="16" fill="#94A3B8">Full‑stack platform for members, coaches, and admins</text>
    </g>
  </svg>

  <p>
    <a href="https://nodejs.org" target="_blank"><img alt="Node.js" src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" /></a>
    <a href="https://expressjs.com" target="_blank"><img alt="Express" src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" /></a>
    <a href="https://react.dev" target="_blank"><img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" /></a>
    <a href="https://www.mongodb.com" target="_blank"><img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-4.x+-47A248?style=for-the-badge&logo=mongodb&logoColor=white" /></a>
    <a href="LICENSE" target="_blank"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-0ea5e9?style=for-the-badge" /></a>
  </p>
  <p>
    <em>Modern, structured documentation with lightweight 3D visuals (SVG) for an engaging README.</em>
  </p>
</div>

---

### Overview

Maxxie is a full‑stack web application that streamlines fitness center operations — member registration, appointments, personalized workout and diet plans, supplement store with cart/checkout UI, payments and expenses tracking, and rich admin tooling.

Key goals:

- Consistent member experience across plans, sessions, and feedback
- Efficient admin workflows for inventory, sessions, plans, and finance
- Secure API with JWT, robust validation, and media uploads

---

### Monorepo Layout

```
.
├── backend/           # Express + MongoDB API, uploads, auth, plans, sessions, finance
└── frontend/          # React app (CRA), MUI + Bootstrap UI, charts, reports
```

---

### Features

- General
  - Authentication with roles (member, admin)
  - Responsive UI for desktop/mobile
  - Profile and password reset
- Member
  - Membership plan management
  - Book/edit/cancel appointments (PT, group, yoga, crossfit)
  - Assigned workout and diet plans with feedback
  - Supplement store with cart and order confirmation
  - Payment history (UI)
- Admin
  - Manage users/roles, membership plans, appointments
  - CRUD workout and diet plans, feedback review
  - Supplement inventory and analytics
  - Record and fetch payments/expenses

---

### Tech Stack

- Frontend: React, React Router, Redux, Axios, MUI, Bootstrap, Chart.js, jsPDF
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, Multer, bcrypt, dotenv
- Utilities: Nodemailer, Recharts, html2canvas

---

### Quick Start

Requirements:

- Node.js 16+ (18+ recommended)
- npm
- MongoDB (local or Atlas)

1) Backend

```
cd backend
npm install
cp .env.example .env  # If you have a template; otherwise create .env as below
npm run dev           # or: npm start (runs on PORT or 5000)
```

2) Frontend

```
cd frontend
npm install
npm start             # CRA dev server on http://localhost:3000
```

Default dev ports:

- API server: http://localhost:5000 (CORS allows http://localhost:3000 and http://localhost:3001)
- Frontend: http://localhost:3000

---

### Environment Variables (Backend)

Create `backend/.env` with at least:

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/maxxie
JWT_SECRET=your_super_secret_jwt_key
```

Notes:

- The running server uses `MONGO_URI` (see `backend/server.js`).
- If you use a separate connector (`backend/config/db.js`) it expects `MONGO_URL`. Prefer `MONGO_URI` to match the active server.

---

### Scripts

- Backend
  - `npm run dev` — start Express with nodemon
  - `npm start` — start Express once
- Frontend
  - `npm start` — start CRA dev server
  - `npm run build` — production build
  - `npm run deploy` — deploy to GitHub Pages (configured via `homepage`)

---

### Core API Endpoints

Base URL: `http://localhost:5000`

- Auth & Users: `POST /user/login`, `POST /user/register`, `GET /user/profile` (token)
- Workout Plans: `GET/POST /api/workout-plans`
- Diet Plans: `GET/POST /api/diet-plans`
- Membership Plans: `GET/POST /api/membership-plans`
- Supplements: `GET/POST /api/supplements`
- Admin: `GET/POST /api/admin`
- Workout Feedback: `GET/POST /api/workout-feedback`
- Diet Feedback: `GET/POST /api/diet-feedback`
- Appointments: `GET/POST /api/appointment`
- Sessions: `GET/POST /api/sessions`
- Finance: `GET/POST /finance`

Uploads: Static files are served from `/uploads`.

---

### Architecture

```mermaid
flowchart LR
  subgraph Client[React App]
    A[UI Components\nMUI + Bootstrap]
    B[Redux / Context]
    C[Axios Services]
  end

  subgraph Server[Express API]
    D[Auth & Users]
    E[Plans & Feedback]
    F[Supplements & Cart]
    G[Appointments & Sessions]
    H[Finance]
    I[(MongoDB)]
  end

  A --> B --> C --> D
  C --> E
  C --> F
  C --> G
  C --> H
  D --- I
  E --- I
  F --- I
  G --- I
  H --- I
```

---

### Screenshots & Branding

You can add screenshots or GIFs here to showcase flows. A project logo is available:

![Maxxie Logo](frontend/public/maxxieslogo.png)

---

### Contributing

1. Fork and clone the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit changes: `git commit -m "feat: add your feature"`
4. Push and open a Pull Request

Please keep code readable, typed where applicable, and follow existing patterns for routes, models, and components.

---

### License

This project is licensed under the MIT License. See `LICENSE` for details.

---

### Reference

- Repository: [Maxxie_Fitness_Management_System on GitHub](https://github.com/Saumya-Us/Maxxie_Fitness_Management_System)
