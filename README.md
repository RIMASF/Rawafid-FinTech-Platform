# Rawafed Fintech 2026

A full-stack web platform for the **Rawafed Fintech 2026** event at Imam Muhammad Ibn Saud Islamic University, Riyadh — connecting students and professionals with fintech companies, internships, and career opportunities.

---

## Features

- **Authentication** — Email/password signup and login with JWT
- **OTP Verification** — 6-digit email verification via Resend
- **Google OAuth** — One-click sign-in with Google
- **Event Ticket** — Auto-generated QR code ticket for each attendee
- **Dashboard** — Personalized dashboard with saved opportunities
- **Opportunity Explorer** — Browse and save internships, jobs, and co-ops
- **Multi-language** — Full Arabic and English support with RTL layout
- **Role-based Signup** — Separate flows for students, employees, and guests

---

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- React Router
- Sonner (toasts)
- QRCode.react

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- Resend (email)
- Google Auth Library

---

## Project Structure

```
project/
├── frontend/          # React + TypeScript app
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── store/
│       ├── i18n/
│       └── lib/
└── backend/           # Node.js + Express API
    └── src/
        ├── models/
        ├── routes/
        ├── utils/
        └── middleware/
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB database
- Resend API key
- Google OAuth client ID

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
RESEND_API_KEY=your_resend_api_key
GOOGLE_CLIENT_ID=your_google_client_id
CLIENT_URL=http://localhost:8080
```

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

```bash
npm run dev
```

---

## Event Info

- **Date:** May 18–19, 2026
- **Venue:** Imam Muhammad Ibn Saud Islamic University, Riyadh
- **Partners:** 20+ fintech companies
- **Opportunities:** 300+ internships and jobs
