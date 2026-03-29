# OmniCart Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js (v18+) installed: `node --version`
- ✅ MongoDB installed locally OR MongoDB Atlas account
- ✅ npm installed: `npm --version`

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Configure Environment

Create `server/.env` file:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/omnicart
JWT_SECRET=change-this-to-a-secure-random-string
CORS_ORIGIN=http://localhost:3000
```

> **Using MongoDB Atlas?** Replace `MONGODB_URI` with your Atlas connection string.

### 3. Seed Database (Optional)

```bash
cd server
node seed.js
```

This adds sample products and test users to your database.

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 5. Open Application

Navigate to: **http://localhost:3000**

## Test Accounts

After seeding, you can login with:
- Email: `john@example.com` | Password: `password123`
- Email: `jane@example.com` | Password: `password123`

## API Testing

Test the backend API:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"OK","message":"OmniCart API is running"}
```

## Common Issues

### MongoDB Connection Error
- **Local MongoDB**: Ensure MongoDB is running (`mongod`)
- **MongoDB Atlas**: Check connection string and IP whitelist

### Port Already in Use
- Change `PORT` in `server/.env`
- Change `port` in `client/vite.config.ts`

### CORS Errors
- Verify `CORS_ORIGIN` in `server/.env` matches your frontend URL

## Next Steps

1. Explore the API endpoints in the [README.md](file:///c:/Users/harsh/OmniCart/README.md)
2. Connect existing React pages to the backend using `client/api.ts`
3. Implement authentication flow in the frontend
4. Deploy to Netlify following the deployment guide

## Need Help?

Check the comprehensive documentation in [README.md](file:///c:/Users/harsh/OmniCart/README.md) or the [walkthrough.md](file:///C:/Users/harsh/.gemini/antigravity/brain/1971474b-6580-46c4-a900-b4b90830d148/walkthrough.md).
