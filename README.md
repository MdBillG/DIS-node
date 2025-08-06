# DIS Node.js API

A Node.js API built with Express and MongoDB.

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB Atlas account (for cloud database)

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```
MONGO_URI=your_mongodb_connection_string
PORT=3003
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment to Vercel

1. Install Vercel CLI (if not already installed):
   ```bash
   npm install -g vercel
   ```
2. Login to Vercel:
   ```bash
   vercel login
   ```
3. Deploy:
   ```bash
   vercel
   ```
4. Set environment variables in Vercel dashboard:
   - Go to your project in Vercel
   - Navigate to Settings > Environment Variables
   - Add the required environment variables from `.env`

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/roles` - Create a new role
- `GET /api/roles` - Get all roles
