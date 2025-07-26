# Backend API - Authentication System

This is the Node.js/Express backend for the authentication system with email verification and admin approval workflow.

## Features

- User registration with email verification
- JWT-based authentication
- Admin approval workflow
- Email notifications using Nodemailer
- MongoDB Atlas integration
- Role-based access control

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   - Copy `env.example` to `.env`
   - Update the following variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A secure random string for JWT signing
     - `EMAIL_USER`: Your Gmail address
     - `EMAIL_PASS`: Your Gmail app-specific password
     - `FRONTEND_URL`: Your frontend URL (for email links)

3. **Gmail Setup:**
   - Enable 2-factor authentication on your Gmail account
   - Generate an app-specific password
   - Use this password in `EMAIL_PASS`

4. **MongoDB Atlas Setup:**
   - Create a MongoDB Atlas cluster
   - Get your connection string
   - Update `MONGODB_URI` in `.env`

## Running the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - User login
- `POST /verify-email` - Verify email address
- `GET /me` - Get current user (requires auth)
- `POST /logout` - Logout (requires auth)

### Admin Routes (`/api/admin`)

- `GET /users` - Get all users (requires admin)
- `GET /pending-users` - Get pending users (requires admin)
- `POST /approve-user/:userId` - Approve user (requires admin)
- `POST /reject-user/:userId` - Reject user (requires admin)
- `GET /stats` - Get user statistics (requires admin)
- `POST /create-admin` - Create initial admin user

## Initial Setup

1. **Create Admin User:**
   ```bash
   curl -X POST http://localhost:5000/api/admin/create-admin \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "Admin",
       "lastName": "User",
       "email": "admin@example.com",
       "password": "admin123"
     }'
   ```

2. **Test Registration:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "John",
       "lastName": "Doe",
       "email": "john@example.com",
       "password": "password123"
     }'
   ```

## Email Workflow

1. User registers → Email verification sent
2. User verifies email → Admin notification sent
3. Admin approves user → Approval email sent
4. User can now login

## Deployment

For production deployment on Render:

1. Set environment variables in Render dashboard
2. Build command: `npm install`
3. Start command: `npm start`
4. Set `NODE_ENV=production`

## Security Notes

- Change `JWT_SECRET` in production
- Use HTTPS in production
- Set up proper CORS configuration
- Implement rate limiting
- Add input validation middleware 