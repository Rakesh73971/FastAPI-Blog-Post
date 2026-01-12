# Blog Post Frontend

React frontend for the FastAPI blog post application.

## Features

- User authentication (Login/Signup)
- View all blog posts with search and pagination
- Create, edit, and delete posts
- Vote on posts
- Responsive design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the frontend directory:
```
VITE_API_URL=http://localhost:8000
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port shown in the terminal).

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable components (Navbar, ProtectedRoute)
│   ├── context/        # React context (AuthContext)
│   ├── pages/          # Page components (Login, PostList, etc.)
│   ├── services/       # API service layer
│   ├── App.jsx         # Main app component with routing
│   └── main.jsx        # Entry point
├── .env.example        # Environment variables example
└── package.json        # Dependencies
```

## API Integration

The frontend communicates with the FastAPI backend at the URL specified in `VITE_API_URL`. Make sure your backend is running before starting the frontend.

## Authentication

All routes except login and signup are protected and require authentication. Users must log in to view posts, create posts, or vote.
