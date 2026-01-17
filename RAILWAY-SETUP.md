# Railway Deployment - Environment Variables Setup

## ⚠️ Important: Railway Doesn't Use .env Files

Railway reads environment variables from its dashboard, NOT from `.env` files. You must add them manually in Railway.

## 📝 Step-by-Step: Add Environment Variables in Railway

### Step 1: Go to Your Railway Project

1. Go to [railway.app](https://railway.app)
2. Click on your project: `ruby-auto-parts-server` (or your project name)
3. Click on your service (the deployed app)

### Step 2: Open Variables Tab

1. Click on the **"Variables"** tab (top menu)
2. You'll see a list of environment variables (probably empty)

### Step 3: Add Each Variable

Click **"New Variable"** and add these one by one:

#### 1. MongoDB URI
```
Variable Name: MONGODB_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```
*(Replace with your actual MongoDB connection string)*

#### 2. Cloudinary Cloud Name
```
Variable Name: CLOUDINARY_CLOUD_NAME
Value: your_cloud_name
```

#### 3. Cloudinary API Key
```
Variable Name: CLOUDINARY_API_KEY
Value: your_api_key
```

#### 4. Cloudinary API Secret
```
Variable Name: CLOUDINARY_API_SECRET
Value: your_api_secret
```

#### 5. Port (Optional - Railway sets this automatically)
```
Variable Name: PORT
Value: 3000
```

#### 6. Node Environment
```
Variable Name: NODE_ENV
Value: production
```

### Step 4: Save and Redeploy

1. After adding all variables, Railway will **automatically redeploy**
2. Wait for deployment to complete
3. Check the logs to verify everything works

### Step 5: Verify in Logs

After redeployment, check the logs. You should see:
```
✅ Cloudinary configured
   Cloud: your_cloud_name
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 Server running on port 8080
```

## 🔍 How to Find Your Values

### MongoDB URI
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password

### Cloudinary Credentials
1. Go to [Cloudinary Dashboard](https://console.cloudinary.com/)
2. Go to "Settings" → "Access Keys"
3. Copy:
   - Cloud Name
   - API Key
   - API Secret

## ⚠️ Common Mistakes

1. **Typo in variable name** - Must be exact: `MONGODB_URI` (not `MONGODB_URL`)
2. **Missing quotes** - Don't add quotes around values in Railway
3. **Wrong format** - MongoDB URI should start with `mongodb+srv://`
4. **Not waiting for redeploy** - Railway redeploys automatically after adding variables

## ✅ Quick Checklist

- [ ] MONGODB_URI added
- [ ] CLOUDINARY_CLOUD_NAME added
- [ ] CLOUDINARY_API_KEY added
- [ ] CLOUDINARY_API_SECRET added
- [ ] PORT added (optional)
- [ ] NODE_ENV set to production
- [ ] Deployment completed
- [ ] Logs show "✅ MongoDB Connected"
- [ ] Logs show "✅ Cloudinary configured"

## 🐛 Still Not Working?

1. **Check variable names** - Must match exactly (case-sensitive)
2. **Check logs** - Railway shows errors in the logs tab
3. **Redeploy manually** - Click "Deploy" → "Redeploy"
4. **Verify values** - Make sure no extra spaces or quotes

