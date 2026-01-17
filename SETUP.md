# Quick Setup Guide

## Step 1: Create .env file

Create a file named `.env` in the `server` folder with this content:

```
MONGODB_URI=mongodb+srv://paperplanefire_db_user:8NGOvUD3DOpovHZK@rubyautoparts.kfazpev.mongodb.net/?appName=rubyautoparts

CLOUDINARY_CLOUD_NAME=dq0wphoox
CLOUDINARY_API_KEY=676149497229312
CLOUDINARY_API_SECRET=0RK8E-4XQ65O4f_KZ-dT9v8KsEs
CLOUDINARY_URL=cloudinary://676149497229312:0RK8E-4XQ65O4f_KZ-dT9v8KsEs@dq0wphoox

PORT=3000
NODE_ENV=development
```

## Step 2: Install Dependencies

```bash
cd server
npm install
```

## Step 3: Start Server

```bash
npm run dev
```

Server will run on http://localhost:3000

## Step 4: Test API

Open browser and go to: http://localhost:3000/api/health

You should see: `{"success":true,"message":"Server is running"}`

## Next Steps

1. Update admin panel to connect to API (I'll do this next)
2. Update main website to fetch from API
3. Deploy server to cloud (Railway, Render, etc.)

