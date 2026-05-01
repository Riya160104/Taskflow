TEAM TASK MANAGER - FULL STACK APPLICATION
============================================

LIVE URL: taskflow-tracker.up.railway.app
GITHUB REPO: https://github.com/Riya160104/Taskflow.git

PROJECT OVERVIEW
----------------
A complete task management web app where users can create projects, assign tasks, track progress, and collaborate with team members. Role-based access control (Admin/Member). Beautiful earthy color UI.

FEATURES
--------
- Authentication (Signup / Login with JWT)
- Role-based access – Admin, Member
- Project Management – Create, view, delete projects
- Team Management – Add/remove members to projects (Admin only)
- Task Management – Create, assign, update status (pending/in-progress/completed)
- Dashboard – Total tasks, pending, in-progress, completed, overdue counts
- Today View – See tasks due today
- Responsive UI – Pure CSS, glassmorphism, centered layout
- Database – SQLite (development) / PostgreSQL (production on Railway)

TECH STACK
----------
Backend:
- Node.js + Express
- Sequelize ORM
- SQLite (local) / PostgreSQL (Railway)
- JWT authentication
- bcryptjs for password hashing

Frontend:
- React 18 + Vite
- React Router for navigation
- Axios for API calls
- Pure CSS with custom design system

Deployment:
- Hosted on Railway
- PostgreSQL plugin for production database

LOCAL SETUP INSTRUCTIONS
------------------------

Prerequisites:
- Node.js (v18 or higher)
- Git

Steps:

1. Clone the repository
   git clone <your-repo-url>
   cd team-task-manager

2. Backend setup
   cd backend
   npm install
   Create .env file with:
     PORT=5000
     JWT_SECRET=your_secret_key
     NODE_ENV=development
   (No DATABASE_URL needed – SQLite auto-creates)

3. Frontend setup
   cd ../frontend
   npm install

4. Run the app
   Terminal 1 (backend): cd backend && npm run dev
   Terminal 2 (frontend): cd frontend && npm run dev

5. Open browser at http://localhost:3000

Default admin account (auto-created):
   Email: admin@example.com
   Password: admin123

ROLE-BASED ACCESS MATRIX
------------------------

Action                                | Admin | Member
--------------------------------------|-------|--------
Create/Edit/Delete project            | Yes   | No
Add/Remove team members               | Yes   | No
Create/Edit/Delete tasks              | Yes   | No
Update own task status                | Yes   | Yes
View all projects (admin: all, member: joined) | Yes | Yes (only joined)
View dashboard stats                  | Yes   | Yes (own tasks)

DEPLOYMENT TO RAILWAY (FOR REFERENCE)
-------------------------------------

1. Push code to GitHub
2. Create new project on Railway.app
3. Deploy from GitHub repo
4. Add PostgreSQL plugin
5. Set environment variables in main service:
   - NODE_ENV=production
   - JWT_SECRET=<random_string>
   - DATABASE_URL (copy from PostgreSQL service)
6. Railway auto builds and deploys

API ENDPOINTS (REST)
--------------------

Auth:
  POST /api/auth/signup  - Register user
  POST /api/auth/login   - Login

Projects:
  GET    /api/projects        - Get projects
  POST   /api/projects        - Create project (admin)
  PUT    /api/projects/:id    - Update project (admin)
  DELETE /api/projects/:id    - Delete project (admin)

Members:
  GET    /api/projects/:id/members       - Get members
  POST   /api/projects/:id/members       - Add member (admin)
  DELETE /api/projects/:id/members/:userId - Remove member (admin)

Tasks:
  GET    /api/tasks           - Get tasks (admin: all, member: assigned)
  POST   /api/tasks           - Create task (admin)
  PUT    /api/tasks/:id       - Update task
  DELETE /api/tasks/:id       - Delete task (admin)

Dashboard:
  GET    /api/dashboard       - Get stats + recent tasks

TROUBLESHOOTING
---------------

Issue: "DATABASE_URL undefined" on Railway
Solution: Manually copy DATABASE_URL from PostgreSQL service variables to main service variables.

Issue: API 404 errors on deployed app
Solution: Ensure frontend uses relative "/api" path. In production, Vite serves both frontend and backend from same domain.

Issue: Build fails – missing dependencies
Solution: Run npm install in both backend and frontend folders before commit.

CREDITS
-------
Developed as a full-stack assignment submission.
Design uses custom earthy color palette (Dried Sage, Dusty Rose, Faded Rust, Warm Oak, Bone).

