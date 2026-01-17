const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: [
            'air-conditioning',
            'body-parts',
            'lamp-parts',
            'suspension-steering',
            'engine',
            'electrical',
            'wheels-tires',
            'oil-fluids',
            'windscreen-cleaning',
            'clutch',
            'transmission',
            'filters',
            'interiors',
            'gasket-seals',
            'fuel',
            'exhaust',
            'cooling',
            'service-kit',
            'accessories',
            'brake',
            'belt-chain',
            'fasteners',
            'lighting',
            'universal'
        ]
    },
    carBrand: {
        type: String,
        required: true,
        trim: true
    },
    partBrand: {
        type: String,
        required: true,
        trim: true
    },
    partNumber: {
        type: String,
        required: true,
        trim: true
    },
    partName: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    specifications: {
        type: String,
        default: null
    },
    price: {
        type: Number,
        default: null,
        min: 0
    }
}, {
    timestamps: true
});

// Index for faster searches
partSchema.index({ category: 1 });
partSchema.index({ carBrand: 1 });
partSchema.index({ partBrand: 1 });
partSchema.index({ partNumber: 1 }, { unique: true });
partSchema.index({ partName: 'text' });

module.exports = mongoose.model('Part', partSchema);

