# BlogBugster

Blog application created using MERN STACK.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
    - [Backend Configuration](#backend-configuration)
    - [Frontend Configuration](#frontend-configuration)
- [Usage](#usage)

## Prerequisites

- Node.js (version 22 or higher)
- MongoDB
- Google Account (for email functionality)
- Telegram Bot API key
- Firebase account

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Leytox/BlogBugster.git
   cd blogbugster
   ```

2. Install dependencies for both backend and frontend:
   ```
   cd backend && npm install
   cd frontend && npm install
   ```

## Configuration

### Backend Configuration

Create a `.env` file in the `backend` directory with the following variables:

```
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
GOOGLE_EMAIL=your_google_email@gmail.com
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
TELEGRAM_BOT_API=your_telegram_bot_api_key
CLIENT_URL=http://localhost:5173
```

### Frontend Configuration

Create a `.env` file in the `frontend` directory with the following variables:

```
VITE_BACKEND_URI=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_SITE_API_KEY=your_site_api_key_from_recaptcha
```

## Usage

1. Start the backend server:
   ```
   cd backend && npm start
   ```

2. In a new terminal, start the frontend development server:
   ```
   cd frontend && npm run dev
   ```

3. Access the application at `http://localhost:5173` (or the port specified by Vite).
