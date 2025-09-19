📌 Project Name

Project Planning Application

📝 Description

This is a web-based project planning tool that helps users create projects, break them down into steps and sub-steps, and track progress visually.
The app includes authentication, project management, step/sub-step CRUD operations, progress tracking, and timeline visualization.

🎥 Demo

(Add screenshots or a short GIF here showing the dashboard, creating a project, and step management.)

🛠️ Technology Used

Backend: Node.js, Express.js, Mongoose (MongoDB)

Database: MongoDB Atlas

Authentication: JWT-based auth

Other: Multer for image upload, dotenv, morgan, cors

Frontend (planned/optional): React

🔗 API Routes
Authentication

POST /api/v1/auth/register → Register new user

POST /api/v1/auth/login → Login user

POST /api/v1/auth/logout → Logout

Projects

GET /api/v1/projects → Get all projects

POST /api/v1/projects → Create new project (with image + initial steps)

GET /api/v1/projects/:id → Get project by ID

PATCH /api/v1/projects/:id → Update project

DELETE /api/v1/projects/:id → Delete project (and related steps)

Steps

GET /api/v1/steps/projects/:projectId → List steps for a project

POST /api/v1/steps/projects/:projectId → Create a new step

PATCH /api/v1/steps/:id → Update a step

DELETE /api/v1/steps/:id → Delete a step

Sub-steps

GET /api/v1/steps/:stepId/substeps → List sub-steps of a step

POST /api/v1/steps/:stepId/substeps → Create sub-step

PATCH /api/v1/steps/:stepId/substeps/:subId → Update sub-step

DELETE /api/v1/steps/:stepId/substeps/:subId → Delete sub-step

🗄️ Database Schema
Project
{
title: String,
deadline: Date,
description: String,
imageFilename: String,
}

Step
{
projectId: ObjectId (ref: Project),
name: String,
description: String,
status: "Not Started" | "In Progress" | "Completed",
order: Number,
subSteps: [ { title: String, done: Boolean } ],
}

User
{
username: String,
email: String,
password: String (hashed),
createdAt: Date,
updatedAt: Date
}

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
