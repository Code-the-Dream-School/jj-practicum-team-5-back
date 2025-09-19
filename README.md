📌 Project Name

Project Planning Application

📝 Description

This is a web-based project planning tool that helps users create projects, break them down into steps and sub-steps, and track progress visually.
The app includes authentication, project management, step/sub-step CRUD operations, progress tracking, and timeline visualization.

🎥 Demo

(Add screenshots or a short GIF here showing the dashboard, creating a project, and step management.)

🛠️ Technology Used

Node.js + Express.js – REST API framework

MongoDB + Mongoose – Database and schema modeling

JWT (jsonwebtoken) – Authentication and authorization

bcryptjs – Password hashing

Multer – File/image upload middleware

dotenv – Environment variable management

morgan – Logging middleware

cors – Cross-Origin Resource Sharing

🔗 API Routes
Auth Routes (/api/v1/auth)
POST /register → Register new user
POST /login → Login user and return JWT
POST /check-email → Check if email exists

Project Routes (/api/v1/projects)
POST / → Create new project (with image upload)
GET / → Get all projects
GET /:id → Get project by ID
PUT /:id → Update project (with optional new image)
DELETE /:id → Delete project

Step Routes (/api/v1/steps)
POST /projects/:projectId → Create step for project
GET /projects/:projectId → Get all steps of a project
PATCH /:id → Update step
DELETE /:id → Delete step

Uploads
POST /api/upload → Upload image (returns filename)
GET /uploads/:filename → Serve uploaded image

Sub-steps
GET /api/v1/steps/:stepId/substeps → List sub-steps of a step
POST /api/v1/steps/:stepId/substeps → Create sub-step
PATCH /api/v1/steps/:stepId/substeps/:subId → Update sub-step
DELETE /api/v1/steps/:stepId/substeps/:subId → Delete sub-step

🗄️ Database Schema
User Schema (models/user.js):
first: String, required, only letters
last: String, required, only letters
email: String, required, unique, validated with validator
password: String, hashed with bcrypt, min length 10, must include uppercase, lowercase, number, and special char
Methods:
createJWT() – generates JWT
comparePassword() – compares hashed password

Project Schema (models/Project.js):
title: String, required
description: String, required
status: Enum – Not started, In Progress, Completed, Overdue
date: String, required (deadline/date)
image: String (filename, with UUID added)
steps: Array of stepSchema

Step
projectId: ObjectId (ref: Project),
name: String,
description: String,
status: "Not Started" | "In Progress" | "Completed",
order: Number,
subSteps: [ { title: String, done: Boolean } ],

⚙️ Setup Instructions

Clone the repo

git clone <repo-url>
cd backend

Install dependencies

npm install

Add environment variables
Create a .env file in the root:

PORT=8000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret

Run the server

npm run dev

Test with Postman or connect the frontend.
