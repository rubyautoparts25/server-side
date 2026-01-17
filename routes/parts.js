const express = require('express');
const router = express.Router();
const Part = require('../models/Part');
const cloudinary = require('../config/cloudinary');
const upload = require('../middleware/upload');
const fs = require('fs').promises;

// Get all parts
router.get('/', async (req, res) => {
    try {
        const { category, carBrand, partBrand, search, sortBy } = req.query;
        
        let query = {};
        
        // Filter by category
        if (category) {
            query.category = category;
        }
        
        // Filter by car brand (supports partial matching for vehicle finder)
        if (carBrand) {
            query.carBrand = { $regex: new RegExp(carBrand, 'i') };
        }
        
        // Filter by part brand
        if (partBrand) {
            query.partBrand = partBrand;
        }
        
        // Search in part name and part number
        if (search) {
            query.$or = [
                { partName: { $regex: search, $options: 'i' } },
                { partNumber: { $regex: search, $options: 'i' } },
                { carBrand: { $regex: search, $options: 'i' } },
                { partBrand: { $regex: search, $options: 'i' } }
            ];
        }
        
        let parts = await Part.find(query);
        
        // Sort parts
        if (sortBy) {
            const [field, order] = sortBy.split('-');
            const sortOrder = order === 'Desc' ? -1 : 1;
            parts.sort((a, b) => {
                let primaryCompare = 0;
                let secondaryCompare = 0;
                let tertiaryCompare = 0;
                
                switch (field) {
                    case 'carBrand':
                        primaryCompare = a.carBrand.localeCompare(b.carBrand) * sortOrder;
                        secondaryCompare = a.partBrand.localeCompare(b.partBrand);
                        tertiaryCompare = a.partNumber.localeCompare(b.partNumber);
                        break;
                    case 'partBrand':
                        primaryCompare = a.partBrand.localeCompare(b.partBrand) * sortOrder;
                        secondaryCompare = a.carBrand.localeCompare(b.carBrand);
                        tertiaryCompare = a.partNumber.localeCompare(b.partNumber);
                        break;
                    case 'partNumber':
                        primaryCompare = a.partNumber.localeCompare(b.partNumber) * sortOrder;
                        secondaryCompare = a.carBrand.localeCompare(b.carBrand);
                        tertiaryCompare = a.partBrand.localeCompare(b.partBrand);
                        break;
                    case 'partName':
                        primaryCompare = a.partName.localeCompare(b.partName) * sortOrder;
                        secondaryCompare = a.carBrand.localeCompare(b.carBrand);
                        tertiaryCompare = a.partBrand.localeCompare(b.partBrand);
                        break;
                    default:
                        primaryCompare = a.carBrand.localeCompare(b.carBrand);
                        secondaryCompare = a.partBrand.localeCompare(b.partBrand);
                        tertiaryCompare = a.partNumber.localeCompare(b.partNumber);
                }
                
                if (primaryCompare !== 0) return primaryCompare;
                if (secondaryCompare !== 0) return secondaryCompare;
                return tertiaryCompare;
            });
        }
        
        res.json({
            success: true,
            count: parts.length,
            data: parts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching parts',
            error: error.message
        });
    }
});

// Get parts by category
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const parts = await Part.find({ category });
        
        res.json({
            success: true,
            count: parts.length,
            data: parts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching parts by category',
            error: error.message
        });
    }
});

// Get single part by ID
router.get('/:id', async (req, res) => {
    try {
        const part = await Part.findById(req.params.id);
        
        if (!part) {
            return res.status(404).json({
                success: false,
                message: 'Part not found'
            });
        }
        
        res.json({
            success: true,
            data: part
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching part',
            error: error.message
        });
    }
});

// Create new part
router.post('/', upload.single('image'), async (req, res) => {
    try {
        console.log('📥 Received part creation request');
        console.log('📋 Request body:', req.body);
        console.log('📁 File received:', req.file ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path
        } : 'No file received');
        
        const { category, carBrand, carModel, carYear, partBrand, partNumber, partName, description, specifications, imageUrl, price } = req.body;
        
        let image = imageUrl || null;
        
        // Upload image to Cloudinary if file was uploaded
        if (req.file) {
            try {
                console.log('📤 Uploading image to Cloudinary...');
                console.log('   File path:', req.file.path);
                console.log('   File size:', req.file.size, 'bytes');
                console.log('   File type:', req.file.mimetype);
                
                // Check if file exists
                try {
                    await fs.access(req.file.path);
                    console.log('✅ File exists at path');
                } catch (accessError) {
                    console.error('❌ File does not exist at path:', req.file.path);
                    throw new Error('Uploaded file not found');
                }
                
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'ruby-autoparts',
                    resource_type: 'auto'
                });
                
                image = result.secure_url;
                console.log('✅ Image uploaded successfully to Cloudinary');
                console.log('   Image URL:', image);
                console.log('   Public ID:', result.public_id);
                
                // Delete temporary file
                await fs.unlink(req.file.path);
                console.log('✅ Temporary file deleted');
            } catch (uploadError) {
                console.error('❌ Cloudinary upload error:', uploadError);
                console.error('   Error message:', uploadError.message);
                console.error('   Error code:', uploadError.http_code);
                console.error('   Error name:', uploadError.name);
                console.error('   Full error:', JSON.stringify(uploadError, null, 2));
                
                // Delete temporary file even if upload failed
                try {
                    await fs.unlink(req.file.path);
                    console.log('✅ Temporary file deleted after error');
                } catch (unlinkError) {
                    console.error('⚠️ Could not delete temporary file:', unlinkError.message);
                }
                
                // If Cloudinary fails, continue without image (don't block part creation)
                console.warn('⚠️ Continuing without image due to Cloudinary error');
                image = null;
            }
        } else {
            console.log('ℹ️ No image file in request');
            if (imageUrl) {
                console.log('ℹ️ Using provided imageUrl:', imageUrl);
            }
        }
        
        // Validate required fields
        if (!category || !carBrand || !partBrand || !partNumber || !partName) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: category, carBrand, partBrand, partNumber, partName'
            });
        }
        
        console.log('💾 Creating part in database...');
        console.log('   Image URL to save:', image);
        
        const part = await Part.create({
            category,
            carBrand,
            partBrand,
            partNumber,
            partName,
            image,
            description: description || null,
            specifications: specifications || null,
            price: price ? parseFloat(price) : null
        });
        
        console.log('✅ Part created successfully');
        console.log('   Part ID:', part._id);
        console.log('   Saved image URL:', part.image);
        
        res.status(201).json({
            success: true,
            message: 'Part created successfully',
            data: part
        });
    } catch (error) {
        // Delete temporary file if it exists
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => {});
        }
        
        console.error('Error creating part:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Part number already exists'
            });
        }
        
        // Check for validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error creating part',
            error: error.message
        });
    }
});

// Update part
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        console.log('📥 Received part update request for ID:', req.params.id);
        console.log('📁 File received:', req.file ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path
        } : 'No file received');
        
        const { category, carBrand, partBrand, partNumber, partName, description, specifications, imageUrl, price } = req.body;
        
        let updateData = {
            category,
            carBrand,
            partBrand,
            partNumber,
            partName,
            description: description || null,
            specifications: specifications || null,
            price: price ? parseFloat(price) : null
        };
        
        // Upload new image if provided
        if (req.file) {
            try {
                console.log('📤 Uploading new image to Cloudinary...');
                console.log('   File path:', req.file.path);
                
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'ruby-autoparts',
                    resource_type: 'auto'
                });
                
                updateData.image = result.secure_url;
                console.log('✅ Image uploaded successfully:', result.secure_url);
                
                // Delete temporary file
                await fs.unlink(req.file.path);
            } catch (uploadError) {
                console.error('❌ Cloudinary upload error:', uploadError);
                console.error('   Error message:', uploadError.message);
                await fs.unlink(req.file.path).catch(() => {});
                // Continue without image if Cloudinary fails
                console.warn('⚠️ Continuing without image due to Cloudinary error');
                updateData.image = imageUrl || null;
            }
        } else if (imageUrl) {
            console.log('ℹ️ Using provided imageUrl:', imageUrl);
            updateData.image = imageUrl;
        } else {
            console.log('ℹ️ No new image provided, keeping existing image');
        }
        
        console.log('💾 Updating part in database...');
        console.log('   Image URL to save:', updateData.image);
        
        const part = await Part.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!part) {
            return res.status(404).json({
                success: false,
                message: 'Part not found'
            });
        }
        
        console.log('✅ Part updated successfully');
        console.log('   Saved image URL:', part.image);
        
        res.json({
            success: true,
            message: 'Part updated successfully',
            data: part
        });
    } catch (error) {
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => {});
        }
        
        res.status(500).json({
            success: false,
            message: 'Error updating part',
            error: error.message
        });
    }
});

// Delete part
router.delete('/:id', async (req, res) => {
    try {
        const part = await Part.findById(req.params.id);
        
        if (!part) {
            return res.status(404).json({
                success: false,
                message: 'Part not found'
            });
        }
        
        // Delete image from Cloudinary if exists
        if (part.image && part.image.includes('cloudinary.com')) {
            try {
                // Extract public_id from Cloudinary URL
                const urlParts = part.image.split('/');
                const publicId = urlParts.slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(`ruby-autoparts/${publicId}`);
            } catch (cloudinaryError) {
                console.error('Error deleting from Cloudinary:', cloudinaryError);
                // Continue with part deletion even if image deletion fails
            }
        }
        
        await Part.findByIdAndDelete(req.params.id);
        
        res.json({
            success: true,
            message: 'Part deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting part',
            error: error.message
        });
    }
});

// Get statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const totalParts = await Part.countDocuments();
        const partsWithImages = await Part.countDocuments({ image: { $ne: null } });
        const categories = await Part.distinct('category');
        const carBrands = await Part.distinct('carBrand');
        
        res.json({
            success: true,
            data: {
                totalParts,
                partsWithImages,
                totalCategories: categories.length,
                totalBrands: carBrands.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
});

module.exports = router;

