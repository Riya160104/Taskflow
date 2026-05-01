TEAM TASK MANAGER - Full Stack Application
===========================================

Live URL: [taskflow-tracker.up.railway.app]


Features:
---------
- Authentication (Signup/Login with JWT)
- Role-based Access Control (Admin/Member)
- Project Management (Create, View, Delete)
- Team Management (Add/Remove members to projects)
- Task Management (Create, Assign, Update Status)
- Dashboard with task statistics (Total, Pending, In-progress, Completed, Overdue)
- Responsive UI with Tailwind CSS

Tech Stack:
-----------
Backend: Node.js, Express, Sequelize ORM, PostgreSQL, JWT
Frontend: React, Vite, React Router, Axios, Tailwind CSS
Deployment: Railway

Local Setup:
------------
1. Clone repository
2. Create PostgreSQL database
3. Copy backend/.env.example to backend/.env and update credentials
4. Install dependencies:
   - cd backend && npm install
   - cd frontend && npm install
5. Run backend: cd backend && npm run dev (port 5000)
6. Run frontend: cd frontend && npm run dev (port 3000)
7. Access http://localhost:3000

Default Admin Account:
----------------------
Email: admin@example.com
Password: admin123

API Endpoints:
--------------
POST   /api/auth/signup     - Register user
POST   /api/auth/login      - Login
GET    /api/projects        - Get projects (admin: all, member: joined)
POST   /api/projects        - Create project (admin only)
PUT    /api/projects/:id    - Update project (admin only)
DELETE /api/projects/:id    - Delete project (admin only)
GET    /api/projects/:id/members - Get project members
POST   /api/projects/:id/members - Add member (admin only)
DELETE /api/projects/:id/members/:userId - Remove member (admin only)
GET    /api/tasks           - Get tasks (admin: all, member: assigned)
POST   /api/tasks           - Create task (admin only)
PUT    /api/tasks/:id       - Update task (admin: any, member: status only)
DELETE /api/tasks/:id       - Delete task (admin only)
GET    /api/dashboard       - Dashboard stats (tasks count, overdue)

Role-Based Access:
------------------
Admin: Full CRUD on projects, tasks, members; can assign tasks
Member: View joined projects, update own task status, view assigned tasks

Deployment to Railway:
----------------------
1. Push code to GitHub repository
2. Create account on railway.app
3. Click "New Project" → "Deploy from GitHub repo"
4. Connect your repository
5. Add PostgreSQL plugin (Railway provides DATABASE_URL)
6. Add environment variables:
   - JWT_SECRET=your_secret_key
   - NODE_ENV=production
   - PORT=5000
7. Railway will auto-build using root package.json scripts
8. Your app will be live at railway.app URL

Note: Database URL is automatically injected by Railway PostgreSQL plugin.

Demo Video Explanation:
-----------------------
The video demonstrates:
1. User registration and login (admin & member accounts)
2. Admin creating a project
3. Admin adding members to the project
4. Admin creating tasks and assigning to members
5. Member logging in and viewing assigned tasks
6. Member updating task status
7. Dashboard showing statistics and overdue tasks
8. Role-based restrictions (member cannot create projects or assign tasks)

Troubleshooting:
----------------
- If database connection fails, check DATABASE_URL environment variable
- Ensure PostgreSQL plugin is added in Railway
- For local development, create .env files with correct credentials

