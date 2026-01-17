# Ruby Auto Parts - Backend Server

Backend server with MongoDB Atlas and Cloudinary integration for managing auto parts inventory.

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Variables
The `.env` file is already configured with your credentials:
- MongoDB Atlas connection string
- Cloudinary credentials

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:3000`

## 📡 API Endpoints

### Parts Management

- `GET /api/parts` - Get all parts (with filters and search)
- `GET /api/parts/category/:category` - Get parts by category
- `GET /api/parts/:id` - Get single part by ID
- `POST /api/parts` - Create new part (with image upload)
- `PUT /api/parts/:id` - Update part (with image upload)
- `DELETE /api/parts/:id` - Delete part
- `GET /api/parts/stats/summary` - Get statistics

### Image Upload

- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images

### Health Check

- `GET /api/health` - Check server status

## 📝 Example API Calls

### Create a Part
```bash
POST /api/parts
Content-Type: multipart/form-data

{
  category: "brake",
  carBrand: "Maruti Suzuki",
  partBrand: "BREMBO",
  partNumber: "BRE-001-BRK",
  partName: "Brake Pads",
  description: "Premium brake pads",
  specifications: "Low Dust | High Performance",
  image: [file]
}
```

### Get Parts by Category
```bash
GET /api/parts/category/brake
```

### Search Parts
```bash
GET /api/parts?search=brake&category=brake&sortBy=carBrand
```

## 🔧 Features

- ✅ MongoDB Atlas integration
- ✅ Cloudinary image storage
- ✅ Automatic image optimization
- ✅ Full CRUD operations
- ✅ Search and filtering
- ✅ Multi-level sorting
- ✅ Statistics endpoint
- ✅ Error handling
- ✅ CORS enabled

## 🌐 Deployment

### Recommended Platforms:

1. **Railway** (Easiest)
   - Connect GitHub repo
   - Auto-deploys on push
   - Free tier available

2. **Render**
   - Free tier available
   - Easy MongoDB connection

3. **Heroku**
   - Add MongoDB Atlas addon
   - Set environment variables

4. **Vercel** (Serverless)
   - Good for API routes
   - Free tier available

### Environment Variables for Deployment:
Make sure to set these in your hosting platform:
- `MONGODB_URI`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_URL`
- `PORT` (optional, defaults to 3000)

## 📦 Project Structure

```
server/
├── config/
│   ├── database.js      # MongoDB connection
│   └── cloudinary.js    # Cloudinary configuration
├── middleware/
│   └── upload.js        # Multer configuration
├── models/
│   └── Part.js          # Part schema
├── routes/
│   ├── parts.js         # Parts API routes
│   └── upload.js        # Image upload routes
├── uploads/             # Temporary file storage
├── .env                 # Environment variables
├── .gitignore
├── package.json
├── server.js           # Main server file
└── README.md
```

## 🔒 Security Notes

- Never commit `.env` file to Git
- Use environment variables in production
- MongoDB Atlas has built-in security
- Cloudinary URLs are secure by default

## 🐛 Troubleshooting

**Connection Error:**
- Check MongoDB Atlas IP whitelist (allow all IPs: 0.0.0.0/0)
- Verify connection string in `.env`

**Image Upload Fails:**
- Check Cloudinary credentials
- Verify file size (max 5MB)
- Check file format (images only)

**Port Already in Use:**
- Change PORT in `.env`
- Or kill process using port 3000

## 📞 Support

For issues or questions, check:
- MongoDB Atlas Dashboard
- Cloudinary Dashboard
- Server logs in console

