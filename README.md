# IIITH Buy-Sell Platform / Buy_Sell_Application_using_MERN_stack

A full-stack web application for IIIT community members to buy and sell items.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Project Structure 

- `/backend`: Node.js and Express server with MongoDB models and routes.
- `/frontend`: React SPA with Material UI components.

## Getting Started

Follow these steps to run the project locally.

### 1. Environment Setup (Backend)
Navigate to the backend directory and create a `.env` file:
```bash
cd backend
# Create a .env file with the following placeholders
```

In your `backend/.env` file, add:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
CAS_URL=https://login.iiit.ac.in/cas
SESSION_SECRET=your_session_secret
```

### 2. Run the Backend
Open a terminal, install the dependencies, and start the development server:
```bash
cd backend
npm install
npm run dev
```
*The backend should now be running on `http://localhost:5000`.*

### 3. Run the Frontend
Open a **new** terminal window, install the dependencies, and start the React app:
```bash
cd frontend
npm install
npm start
```
*The frontend should now be running on `http://localhost:3000`.*
