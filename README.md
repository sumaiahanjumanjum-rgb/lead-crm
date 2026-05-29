# LeadFlow CRM — SQLite Version

No PostgreSQL needed! Uses SQLite (file-based database, zero config).

---

## Setup & Run

### Terminal 1 — Backend
```bash
cd "C:\Users\sumai\Downloads\lead-crm-sqlite (2)\lead-crm-sqlite\backend"
cd backend
npm install
npm run dev
```
✅ You should see:
```
✅ SQLite database ready — leads.db
🚀 Server running on http://localhost:5000
```

### Terminal 2 — Frontend
```bash
cd "C:\Users\sumai\Downloads\lead-crm-sqlite (2)\lead-crm-sqlite\frontend"
cd frontend
npm install
npm start
```
✅ Browser opens at http://localhost:3000

---

That's it! No database installation or password required.
The database is stored as `backend/leads.db` file automatically.
