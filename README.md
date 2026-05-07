# 🚀 TalentFlow Recruitment CRM

TalentFlow is a modern, high-performance Recruitment Management System designed for efficiency and speed. Built with a full-stack TypeScript architecture, it provides a seamless experience for managing candidates, job postings, and recruitment analytics.

![TalentFlow Dashboard](https://img.shields.io/badge/UI-Ant%20Design-blue?style=for-the-badge&logo=ant-design)
![TalentFlow Stack](https://img.shields.io/badge/Stack-TypeScript%20|%20React%20|%20MongoDB-green?style=for-the-badge&logo=typescript)

---

## ✨ Key Features

### 📊 Advanced Dashboard
- **Real-time Analytics**: High-density charts (Bar, Pie, Line, Area) for tracking recruitment trends.
- **Dynamic Stats**: Instant calculation of candidate pipeline status (Hired, Pending, Rejected).
- **Glassmorphism UI**: Modern, sleek design with subtle animations and transparency.

### 💼 Job Management (CRUD)
- **Full Lifecycle**: Create, edit, and delete job postings with ease.
- **Type-Safe Schema**: Backend validation ensures all job data is consistent and accurate.
- **Search & Filter**: Debounced search and category filtering for high-speed job discovery.

### 👥 Candidate Pipeline
- **Professional Grids**: Powered by **AG Grid Community** for high-performance data manipulation.
- **Global Search Bar**: Instant filtering across the entire candidate database.
- **Status Badges**: Visual indicators for candidate progress.

### 🔐 Authentication & Security
- **Role-Based Access**: Secure login and registration.
- **Protected Routes**: Ensuring sensitive data is only accessible to authenticated recruiters.
- **Type-Safe API**: Axios-based service layer with strict generic typing.

---

## 🛠️ Technology Stack

### Frontend
- **React 18** & **Vite**
- **TypeScript** (Strict Mode)
- **Ant Design v5** (Component Library)
- **AG Grid Community** (Data Tables)
- **Recharts** (Data Visualization)
- **Tailwind CSS** (Utility Styling)

### Backend
- **Node.js** & **Express**
- **TypeScript** (via `tsx`)
- **MongoDB** & **Mongoose**
- **JWT** (Authentication)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or via Atlas)
- npm or yarn

### 2. Installation
```bash
# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory (if required) or ensure your `src/services/api.ts` points to the correct backend URL.

### 4. Database Seeding (Optional)
To populate the database with sample candidates and jobs:
```bash
# Run the seed script
npm run seed
```

### 5. Running the Application
You need to start both the frontend and backend.

**Start the Backend:**
```bash
npm run server
```

**Start the Frontend:**
```bash
npm run dev
```

---

## 📁 Project Structure

```text
├── backend/            # Express Server (TypeScript)
│   ├── models/         # Mongoose Schemas (User, Candidate, Job)
│   ├── server.ts       # Main entry point
│   └── seed.ts         # DB Seeding script
├── src/                # React Frontend
│   ├── components/     # Reusable UI & Layout components
│   ├── context/        # Global App State (AppContext)
│   ├── hooks/          # Custom Hooks (useDebounce, useLocalStorage)
│   ├── pages/          # Page Views (Dashboard, Jobs, Candidates)
│   ├── services/       # API integration layer
│   └── types/          # Global TypeScript Interfaces
├── package.json        # Dependencies & Scripts
└── tsconfig.json       # TypeScript Configuration
```

---

## 🎨 UI Best Practices
- **Dark Mode**: Fully supported via the Ant Design `App` provider.
- **Responsiveness**: Mobile-first design using Tailwind CSS and Ant Design Grid.
- **Performance**: Heavy calculations are memoized using `useMemo` and `useCallback`.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ by the TalentFlow Team*