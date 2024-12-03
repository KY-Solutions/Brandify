const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    logo: {
        type: String, // URL or path to logo image
    },
    socialMediaLinks: {
        facebook: { type: String },
        twitter: { type: String },
        instagram: { type: String },
        youtube: { type: String },
    },
    contactInfo: {
        email: { type: String },
        phone: { type: String },
    },
    storeLocation: {
        address: { type: String },
        city: { type: String },
        country: { type: String },
    },
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
