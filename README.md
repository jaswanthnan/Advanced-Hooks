# 🚀 AI-Powered Recruitment CRM

A professional, high-performance Recruitment Dashboard built with the MERN stack (MongoDB, Express, React, Node.js), featuring advanced React patterns, real-time filtering, and local state persistence.

## 🌟 Key Features

- **Advanced Candidate Search**: Optimized server-side filtering using MongoDB regex combined with frontend `useDebounce` and `useMemo` for instant feedback.
- **Persistent Data Grids**: Integrated AG Grid with custom `localStorage` logic to remember your column arrangements, widths, and visibility.
- **Performance Monitoring**: Built-in React Profiler to track rendering efficiency and identify bottlenecks.
- **Predictable State Management**: Utilizes `useReducer` for complex state transitions like candidate editing and job posting.
- **Premium UI/UX**: Crafted with Ant Design (v5), featuring glassmorphism, smooth animations, and a sleek dark-mode compatible design system.
- **AI-Powered Insights**: (In Progress) Intelligent candidate summarization and scoring using Groq (Llama 3.1).

## 🛠️ Tech Stack

### Frontend
- **React + Vite**: Fast, modern frontend framework.
- **TypeScript**: Type-safe development environment.
- **AG Grid Community**: Professional data grid for complex data handling.
- **Ant Design**: Comprehensive UI library for enterprise applications.
- **Recharts**: Dynamic data visualization for dashboard statistics.

### Backend
- **Node.js & Express**: Robust and scalable API layer.
- **MongoDB & Mongoose**: Flexible document-based data storage.
- **tsx**: Modern TypeScript execution for the server.
- **dotenv & CORS**: Secure environment and cross-origin management.

## 🏗️ Advanced React Patterns Implemented

- **`useDebounce`**: Optimizes search fields by delaying API calls until typing stops.
- **`useLocalStorage`**: Automatically persists search terms and grid configurations.
- **`useFetch`**: Custom hook for API calls with built-in `AbortController` to prevent memory leaks.
- **`useIntersectionObserver`**: Enables lazy loading and scroll-based animations.
- **`React.memo` & `useCallback`**: Prevents unnecessary re-renders in heavy components like `JobCard`.
- **`Profiler`**: Diagnostic logs for monitoring component performance thresholds.

## 📂 Project Structure

```text
├── backend/
│   ├── models/       # Mongoose schemas (Candidate, Job, User)
│   └── server.ts     # Express server & API routes
├── src/
│   ├── components/   # Reusable UI & Layout components
│   ├── hooks/        # Custom React hooks (Debounce, Fetch, etc.)
│   ├── pages/        # Main views (Dashboard, Candidates, Jobs)
│   ├── services/     # API interaction layer
│   └── types/        # TypeScript interfaces
├── start-all.bat     # One-click start for Dev environment
└── package.json      # Project dependencies & scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally (default: `mongodb://127.0.0.1:27017/hrms-dashboard`)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment:
   Create a `.env` file in the root (optional, defaults are provided in `server.ts`).

### Running the App
The easiest way to start both the frontend and backend is using the batch script:
```bash
start-all.bat
```
Alternatively:
- **Start Backend**: `npm run server`
- **Start Frontend**: `npm run dev`

## 📊 Performance Verification
Check the browser console to see the system in action:
- `[useReducer] Action: ...` → Tracks every state change.
- `[Profiler] ... duration: ...` → Shows render performance.
- `Filtering Candidates: ...ms` → Performance timing for `useMemo`.

---
Developed as a high-performance Recruitment solution.