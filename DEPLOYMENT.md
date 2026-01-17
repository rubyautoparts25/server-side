# Server Deployment Guide

Backend API server for Ruby Auto Parts website.

## 🚀 Deploy to Railway (Recommended)

### Step 1: Connect to Railway

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose this repository: `rubyautoparts25/server-side`

### Step 2: Configure Settings

Railway will auto-detect Node.js, but verify:
- **Root Directory:** `.` (root of repository)
- **Build Command:** `npm install` (auto-detected)
- **Start Command:** `npm start` or `node server.js`

### Step 3: Add Environment Variables

Go to your project → Variables tab and add:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3000
NODE_ENV=production
```

**Important:** Never commit `.env` file to Git!

### Step 4: Deploy

Railway will automatically:
1. Install dependencies (`npm install`)
2. Start the server (`npm start`)
3. Provide you with a public URL

### Step 5: Get Your API URL

After deployment, Railway provides a URL like:
```
https://your-project-name.up.railway.app
```

Your API base URL will be:
```
https://your-project-name.up.railway.app/api
```

Test it: Visit `https://your-project-name.up.railway.app/api/health`

---

## 🚀 Deploy to Render (Alternative)

### Step 1: Connect to Render

1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click "New" → "Web Service"
4. Connect this repository: `rubyautoparts25/server-side`

### Step 2: Configure Settings

- **Name:** `ruby-auto-parts-api`
- **Environment:** `Node`
- **Root Directory:** `.` (root)
- **Build Command:** `npm install`
- **Start Command:** `node server.js`

### Step 3: Add Environment Variables

Same as Railway (see above)

### Step 4: Deploy

Render will build and deploy. Your API URL will be:
```
https://ruby-auto-parts-api.onrender.com/api
```

---

## 📝 After Deployment

1. **Test your API:**
   ```
   https://your-api-url/api/health
   ```
   Should return: `{"success":true,"message":"Server is running"}`

2. **Update frontend config files:**
   - Public website: Update `config.js` with your API URL
   - Admin side: Update `admin/config.js` with your API URL

3. **Enable CORS:**
   - The server already has CORS enabled for all origins
   - If you need to restrict, update `server.js`

---

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Create .env file with your credentials
# (See SETUP.md for details)

# Start server
npm start

# Or for development with auto-reload
npm run dev
```

---

## 📋 API Endpoints

- `GET /api/health` - Health check
- `GET /api/parts` - Get all parts (with filters)
- `GET /api/parts/:id` - Get single part
- `POST /api/parts` - Create new part
- `PUT /api/parts/:id` - Update part
- `DELETE /api/parts/:id` - Delete part

---

## ⚠️ Important Notes

1. **Environment Variables:** Never commit `.env` file
2. **MongoDB:** Ensure your MongoDB Atlas IP whitelist includes Railway/Render IPs (or use `0.0.0.0/0` for development)
3. **Cloudinary:** Make sure your Cloudinary credentials are correct
4. **Port:** Railway/Render will set PORT automatically, but default is 3000

---

## 🐛 Troubleshooting

**Server won't start:**
- Check environment variables are set correctly
- Check MongoDB connection string
- Check Cloudinary credentials

**API returns errors:**
- Check server logs in Railway/Render dashboard
- Verify MongoDB is accessible
- Verify Cloudinary credentials

**CORS errors:**
- Server has CORS enabled for all origins
- If issues persist, check frontend API URL is correct

---

## 📞 Support

For issues, check:
- Server logs in Railway/Render dashboard
- MongoDB Atlas connection status
- Cloudinary dashboard for image uploads

