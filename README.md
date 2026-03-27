# Student Management System (SMS) - Neo-Brutalism

A full-stack Student Management System with Role-Based Access Control (RBAC) Built using **Node.js, Express, MySQL, React, and TypeScript**, featuring a striking **Neo-Brutalism** UI aesthetic.

## Tech Stack
- **Backend:** Node.js, Express, TypeScript, MySQL (mysql2), JSON Web Tokens (JWT), bcrypt.
- **Frontend:** React (Vite), TypeScript, React Router DOM, Axios, Vanilla CSS (Neo-Brutalism styled).

---

## 🚀 Setup Instructions

### 1. Database Setup
Ensure you have MySQL installed and running locally on port 3306.
1. Create a database named `student_management`.
2. Run the SQL schema and seed file located in `database/schema.sql`.

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=student_management
   JWT_SECRET=super_secret_jwt_key_here
   PORT=5000
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:5000`*.

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will open in your browser, typically on `http://localhost:5173`*.

---

## 🔑 Default Authentication Flow
1. **Admin Initialization**: You should manually insert your first Admin user into the database, or use the database tool to do so.
2. **User Creation**: The Admin creates Students and Teachers via the Dashboard.
3. **First Login**: Any newly created user's default password is their Date of Birth (format: `YYYY-MM-DD`). 
4. **Force Password Change**: Upon logging in with the default password, the system forces the user to the `/change-password` route before accessing any dashboards.

## 🎨 UI/UX Features
- **Neo-Brutalism Aesthetic**: Employs bold black borders (`3px solid #000`), stark drop shadows (`6px 6px 0px #000`), and vibrant contrast colors.
- **Micro-interactions**: Interactive shadow displacement on hover and active states for tactile feedback.
- **Responsive Grid**: Uses CSS Grid for highly adaptable layouts.
