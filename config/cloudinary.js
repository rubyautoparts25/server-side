const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
try {
    // Prefer individual variables for explicit control
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        // Use individual environment variables (more explicit)
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        console.log('✅ Cloudinary configured');
        console.log(`   Cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    } else if (process.env.CLOUDINARY_URL) {
        // Fallback to CLOUDINARY_URL format: cloudinary://api_key:api_secret@cloud_name
        // The SDK automatically reads from process.env.CLOUDINARY_URL
        cloudinary.config();
        console.log('✅ Cloudinary configured from CLOUDINARY_URL');
    } else {
        console.warn('⚠️  Cloudinary credentials missing in .env file');
        console.warn('   Add either CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
    }
} catch (error) {
    console.error('❌ Error configuring Cloudinary:', error.message);
}

module.exports = cloudinary;

