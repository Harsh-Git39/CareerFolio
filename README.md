# Smart Student Hub — Full Stack

React + Node/Express backend with real API calls.

---

## Project Structure

```
ssh_app/
├── backend/
│   ├── package.json
│   ├── index.js          ← Express REST API (port 5000)
│   └── uploads/          ← Auto-created for certificate files
│
└── frontend/
    ├── package.json      ← "proxy": "http://localhost:5000"
    ├── public/index.html
    └── src/
        ├── index.js      ← React entry
        ├── api.js        ← All fetch calls to backend
        └── App.js        ← Full UI (Login, Student, Faculty, Admin)
```

---

## Run Locally

### Terminal 1 — Backend
```bash
cd ssh_app/backend
npm install
npm run dev        # nodemon auto-restart
# OR: npm start
```
Runs at → http://localhost:5000

### Terminal 2 — Frontend
```bash
cd ssh_app/frontend
npm install
npm start
```
Runs at → http://localhost:3000

---

## Demo Login Credentials

| Role    | Email              | Password    |
|---------|--------------------|-------------|
| Student | arjun@git.edu      | student123  |
| Student | sneha@git.edu      | student123  |
| Faculty | priya@git.edu      | faculty123  |
| Admin   | admin@git.edu      | admin123    |

---

## API Endpoints

| Method | Endpoint                    | Description                    |
|--------|-----------------------------|--------------------------------|
| POST   | /api/auth/login             | Login (returns user object)    |
| GET    | /api/achievements           | Get achievements (filters: studentId, facultyId, status) |
| POST   | /api/achievements           | Submit achievement (multipart) |
| PATCH  | /api/achievements/:id       | Approve / Reject               |
| DELETE | /api/achievements/:id       | Delete achievement             |
| GET    | /api/batches                | Get batches (filter: facultyId)|
| POST   | /api/batches                | Create batch                   |
| PATCH  | /api/batches/:id/assign     | Assign faculty to batch        |
| GET    | /api/students               | Get students (filter: facultyId, batchId) |
| GET    | /api/admin/stats            | Institution stats + categories |
| GET    | /api/health                 | Health check                   |

---

## What Works End-to-End

1. **Login** — real POST to backend, role-based dashboard
2. **Student uploads** — multipart form with optional file → saved to /uploads
3. **Faculty verifies** — approve/reject updates status live
4. **Portfolio** — shows only approved achievements from backend
5. **Admin stats** — real counts from backend data
6. **Batch creation** — POST /api/batches persists in-memory
7. **Student table** — GET /api/students with achievement counts

---

## Add a Real Database (SQLite — simple upgrade)

```bash
cd backend && npm install better-sqlite3
```

Replace the in-memory arrays in index.js with:
```js
const Database = require('better-sqlite3');
const db = new Database('ssh.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY, studentId TEXT, title TEXT,
    category TEXT, org TEXT, date TEXT, description TEXT,
    status TEXT DEFAULT 'pending', fileUrl TEXT,
    facultyId TEXT, createdAt TEXT
  );
  CREATE TABLE IF NOT EXISTS users (...);
  CREATE TABLE IF NOT EXISTS batches (...);
`);
```

---

## Deploy

**Backend → Render.com:**
- Root: `backend`, Start: `npm start`

**Frontend → Vercel:**
- Root: `frontend`, Build: `npm run build`
- Add env var: `REACT_APP_API=https://your-backend.onrender.com`
- Update `api.js`: `const BASE = process.env.REACT_APP_API || "/api";`
