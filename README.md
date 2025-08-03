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

### Supported Languages

| Language | Compiler/Interpreter | File Extension |
|----------|---------------------|----------------|
| C++ | GCC | `.cpp` |
| C | GCC | `.c` |
| Python | Python 3 | `.py` |
| Java | OpenJDK | `.java` |

## 🚀 Deployment

### Frontend (Vercel)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Set `VITE_API_URL` to your backend URL
3. **Build Settings**: 
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Backend (Render)

1. **Create Web Service**: Connect your GitHub repository
2. **Environment Variables**: Set up your database connection, JWT secret, and compiler service URL
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`

### Compiler Service (Render)

1. **Create Web Service**: Connect your compiler repository
2. **Environment Variables**: Configure port and environment settings
3. **Build Command**: `npm install`
4. **Start Command**: `node index.mjs`

## 📁 Project Structure

```
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

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Onlinejudge
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Set VITE_API_URL to your backend URL
   npm run dev
   ```

4. **Compiler Service Setup**
   ```bash
   cd compiler
   npm install
   # For Docker deployment
   docker build -t compiler-service .
   docker run -p 8000:8000 compiler-service
   ```

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
COMPILER_SERVICE_URL=http://localhost:8000
GOOGLE_API_KEY=your_google_ai_api_key
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## 🧪 Testing

### API Testing
```bash
# Test backend endpoints
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Compiler Testing
```bash
# Test compiler service
curl -X POST http://localhost:8000/run \
  -H "Content-Type: application/json" \
  -d '{"code":"print(\"Hello, World!\")","language":"python","input":""}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by LeetCode and HackerRank
- Built with modern web technologies
- Special thanks to the open-source community

## 📞 Support

For support, email support@example.com or create an issue in this repository.

---

**Note**: This project is for educational purposes. In production, additional security measures should be implemented for running untrusted code.
