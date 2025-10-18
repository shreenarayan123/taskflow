# Task Management Application

A full-stack task management application built with React (frontend) and Node.js/Express (backend) with MongoDB database. Features include user authentication, CRUD operations for tasks, filtering, search, and analytics dashboard.

## 🚀 Features

### Core Features
- **User Authentication**
  - User registration with email and password
  - JWT token-based authentication
  - Secure login/logout functionality
  - Protected routes (frontend and backend)

- **Task Management**
  - Create, read, update, and delete tasks
  - Task properties: title, description, priority (Low/Medium/High), status (Todo/In Progress/Completed), due date
  - Real-time task status updates
  - Task filtering by status and priority
  - Search tasks by title or description
  - Pagination for large task lists

- **Dashboard & Analytics**
  - Task statistics (total, completed, pending)
  - Priority breakdown visualization
  - Completion rate tracking
  - Recent tasks overview

### Technical Features
- **Backend**
  - RESTful API with Express.js
  - MongoDB with Mongoose ODM
  - JWT authentication middleware
  - Input validation with express-validator
  - Password hashing with bcrypt
  - CORS configuration
  - Error handling middleware
  - Database indexing for performance

- **Frontend**
  - React 18 with modern hooks
  - React Router for navigation
  - Context API for state management
  - Axios for HTTP requests
  - React Hot Toast for notifications
  - Responsive design (mobile-friendly)
  - Form validation
  - Loading states and error handling

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (v4.4 or higher)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-management-app
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit the .env file with your configuration
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/taskmanagement
# JWT_SECRET=your-super-secret-jwt-key-here
# JWT_EXPIRE=30d
# NODE_ENV=development
# FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend/frontend

# Install dependencies
npm install
```

### 4. Database Setup

Make sure MongoDB is running on your system:

```bash
# For Windows (if MongoDB is installed as service)
net start MongoDB

# For macOS (if installed via Homebrew)
brew services start mongodb/brew/mongodb-community

# For Linux
sudo systemctl start mongod
```

## 🚀 Running the Application

### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
The backend server will start on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend/frontend
npm run dev
```
The frontend will start on http://localhost:5173

### Option 2: Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend/frontend
npm run build
npm run preview
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | `{ name, email, password }` |
| POST | `/api/auth/login` | Login user | `{ email, password }` |
| GET | `/api/auth/me` | Get current user | None (requires token) |

### Task Endpoints (Protected)

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/api/tasks` | Get all user tasks | `status`, `priority`, `search`, `page`, `limit` |
| GET | `/api/tasks/:id` | Get single task | None |
| POST | `/api/tasks` | Create new task | Body: task object |
| PUT | `/api/tasks/:id` | Update task | Body: updated fields |
| DELETE | `/api/tasks/:id` | Delete task | None |
| GET | `/api/tasks/stats` | Get task statistics | None |

### Example API Calls

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Create Task:**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Complete project","description":"Finish the task management app","priority":"High","dueDate":"2024-12-31"}'
```

## 🏗️ Project Structure

```
task-management-app/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── Dashboard/
│   │   │   │   └── Dashboard.jsx
│   │   │   ├── Layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── PrivateRoute.jsx
│   │   │   └── Tasks/
│   │   │       ├── TaskForm.jsx
│   │   │       ├── TaskItem.jsx
│   │   │       ├── TaskList.jsx
│   │   │       └── TaskFilters.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanagement
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Important:** 
- Replace `JWT_SECRET` with a strong, random string
- Use a different database name for production
- Change `NODE_ENV` to `production` when deploying

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, valid email),
  password: String (required, min 6 chars, hashed),
  createdAt: Date (auto-generated)
}
```

### Task Model
```javascript
{
  title: String (required, max 100 chars),
  description: String (optional, max 500 chars),
  priority: String (enum: ['Low', 'Medium', 'High'], default: 'Medium'),
  status: String (enum: ['Todo', 'In Progress', 'Completed'], default: 'Todo'),
  dueDate: Date (optional, cannot be in past),
  userId: ObjectId (ref: 'User', required),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-updated)
}
```

## 🔐 Security Features

- **Password Hashing:** Uses bcrypt for secure password storage
- **JWT Authentication:** Stateless authentication with configurable expiration
- **Protected Routes:** Both frontend and backend route protection
- **Input Validation:** Comprehensive validation using express-validator
- **CORS Configuration:** Configured for cross-origin requests
- **Error Handling:** Centralized error handling with proper HTTP status codes

## 📱 Responsive Design

The application is fully responsive and works on:
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (320px - 767px)

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or your preferred MongoDB hosting
2. Update `MONGODB_URI` in production environment
3. Set strong `JWT_SECRET`
4. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Update API base URL in `src/services/api.js`
2. Build the project: `npm run build`
3. Deploy to platforms like Vercel, Netlify, or AWS S3

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] User can register with valid credentials
- [ ] User cannot register with invalid email/password
- [ ] User can login with correct credentials
- [ ] User cannot access protected routes without token
- [ ] User can logout successfully

**Task Management:**
- [ ] User can create tasks with all fields
- [ ] User can view all their tasks
- [ ] User can edit existing tasks
- [ ] User can delete tasks
- [ ] User can filter tasks by status/priority
- [ ] User can search tasks by title/description
- [ ] Pagination works for large task lists

**Dashboard:**
- [ ] Statistics display correctly
- [ ] Priority breakdown shows accurate data
- [ ] Recent tasks are displayed
- [ ] Empty state shows when no tasks exist

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed description
4. Contact the development team

**Happy Task Managing! 🎯**
