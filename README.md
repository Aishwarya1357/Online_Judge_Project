An online judge platform inspired by LeetCode and HackerRank. 
This project allows users to write, submit, and test their solutions to programming problems in real-time, receiving instant feedback on their code's correctness and performance. 
This project was a journey into full-stack development and system design to understand the complexities behind running untrusted user code securely.

1. Features

- Solve a collection of algorithmic problems.

- Submit solutions in multiple languages (e.g., C++, JavaScript, Python).

- Receive real-time compilation, execution, and judging against test cases.

- Get instant feedback on submissions, such as Accepted, Wrong Answer, or Time Limit Exceeded.

2. Tech Stack & Architecture
Frontend: React.js & Tailwind CSS 

Backend: Node.js & Express.js 

Database: MongoDB



System Flow:

A user submits code from the React frontend.

The submission is sent to the Node.js backend.

The backend creates a job and sends the code to the execution engine.

The compiler is used  to compile and run the code.

The execution output is captured and sent back to the backend.

The backend saves the result to MongoDB and notifies the frontend.
