# Next-Node-Auth Backend

This is the backend authentication system for a Node.js and Next.js application. It provides user registration, login, logout, password change, and password reset (via OTP) functionalities using JWT, cookies, and MongoDB.

## Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- Passport.js (JWT strategy)
- bcrypt

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Create a `.env` file in the `backend` directory with the following variables:
     ```env
    PORT=<port-number>
    FRONTEND_HOST=<frontend-url>
    MONGO_URL=<your-mongodb-uri>
    SALT=<number>
    EMAIL_HOST=admin@example.com
    EMAIL_PORT=587
    EMAIL_FROM=<your-email>
    EMAIL_PASS=<your-email-password>
    JWT_ACCESS_TOKEN_SECRET_KEY=<your-access-token-secret>
    JWT_REFRESH_TOKEN_SECRET_KEY=<your-refresh-token-secret>
    NODE_ENV="development" // for locol and for test "production"
     ```

4. **Run the server**
   ```bash
   npm start
   ```
   or (if using bun)
   ```bash
   bun run app.js
   ```
