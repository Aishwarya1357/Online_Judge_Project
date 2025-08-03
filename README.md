# Online Judge Platform

An online judge platform inspired by LeetCode and HackerRank. This project allows users to write, submit, and test their solutions to programming problems in real-time, receiving instant feedback on their code's correctness and performance. This project was a journey into full-stack development and system design to understand the complexities behind running untrusted user code securely.

## 🚀 Live Demo

- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Render
- **Compiler Service**: Deployed on Render

## ✨ Features

- **Multi-language Support**: Solve problems in C++, Python, Java, and C
- **Real-time Code Execution**: Instant compilation and execution with custom input
- **Test Case Validation**: Automated testing against predefined test cases
- **AI-Powered Features**: 
  - Code hints and suggestions
  - AI code review and feedback
- **User Authentication**: Secure login/signup with JWT tokens
- **Admin Panel**: Create, edit, and manage programming questions
- **Submission History**: Track all your previous submissions
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

### System Flow

```
Frontend (React) → Backend (Node.js/Express) → Compiler Service (Docker) → Database (MongoDB)
```

1. **User submits code** from the React frontend
2. **Backend receives submission** and creates a job
3. **Compiler service** compiles and executes the code in isolated containers
4. **Results are captured** and sent back to the backend
5. **Backend saves results** to MongoDB and notifies the frontend
6. **Frontend displays** real-time feedback to the user

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface and state management
- **Redux Toolkit** - Global state management
- **Tailwind CSS** - Styling and responsive design
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Compiler Service
- **Node.js** - Runtime environment
- **Docker** - Containerization for secure code execution
- **Python 3** - For Python code execution
- **GCC** - For C/C++ compilation
- **OpenJDK** - For Java compilation

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend and compiler service hosting
- **MongoDB Atlas** - Cloud database

## 🐳 Docker Implementation

### Compiler Service Docker Setup

The compiler service uses Docker containers to safely execute untrusted user code:

```dockerfile
# Use Node.js base image with Python support
FROM node:18

# Install Python and other dependencies
RUN apt-get update && apt-get install -y python3

# Set working directory
WORKDIR /app

# Copy source code
COPY . .

# Install Node.js dependencies
RUN npm install

# Expose port
EXPOSE 8000

# Start the compiler service
CMD ["node", "index.mjs"]
```

### Security Features

- **Isolated Execution**: Each code submission runs in a separate container
- **Resource Limits**: CPU and memory constraints prevent abuse
- **Timeout Protection**: Automatic termination of long-running processes
- **File System Isolation**: Temporary files are cleaned up after execution
- **Network Isolation**: No external network access during execution



Onlinejudge/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store and slices
│   │   ├── api/            # API client configuration
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── backend/                 # Node.js backend API
│   ├── controllers/        # Request handlers
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   └── db/               # Database connection
└── compiler/              # Docker-based compiler service
    ├── execute.js         # Code execution logic
    ├── generateFile.js    # File generation utilities
    └── Dockerfile         # Docker configuration
```

## 🔧 Local Development

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Docker (for compiler service)

