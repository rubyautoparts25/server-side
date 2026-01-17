const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');
const upload = require('../middleware/upload');
const fs = require('fs').promises;

// Upload single image
router.post('/image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }
        
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'ruby-autoparts',
            resource_type: 'auto'
        });
        
        // Delete temporary file
        await fs.unlink(req.file.path);
        
        res.json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format
            }
        });
    } catch (error) {
        // Delete temporary file if it exists
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => {});
        }
        
        res.status(500).json({
            success: false,
            message: 'Error uploading image',
            error: error.message
        });
    }
});

// Upload multiple images
router.post('/images', upload.array('images', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No image files provided'
            });
        }
        
        const uploadResults = [];
        
        for (const file of req.files) {
            try {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'ruby-autoparts',
                    resource_type: 'auto'
                });
                
                uploadResults.push({
                    url: result.secure_url,
                    publicId: result.public_id,
                    width: result.width,
                    height: result.height,
                    format: result.format,
                    originalName: file.originalname
                });
                
                // Delete temporary file
                await fs.unlink(file.path);
            } catch (uploadError) {
                console.error(`Error uploading ${file.originalname}:`, uploadError);
                // Delete temporary file even if upload failed
                await fs.unlink(file.path).catch(() => {});
            }
        }
        
        res.json({
            success: true,
            message: `${uploadResults.length} image(s) uploaded successfully`,
            data: uploadResults
        });
    } catch (error) {
        // Clean up any remaining files
        if (req.files) {
            for (const file of req.files) {
                await fs.unlink(file.path).catch(() => {});
            }
        }
        
        res.status(500).json({
            success: false,
            message: 'Error uploading images',
            error: error.message
        });
    }
});

module.exports = router;

