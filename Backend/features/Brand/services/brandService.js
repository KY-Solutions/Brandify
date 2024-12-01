const Brand = require('../models/brandModel');
const _ = require('lodash');

class brandService {
    static async createOrUpdateBrand(brandData) {
        const existingBrand = await Brand.findOne({ name: brandData.name });
    
        if (existingBrand) {
            // Update the existing brand
            Object.assign(existingBrand, brandData);
            return await existingBrand.save();
        }
    
        // Create a new brand
        const brand = new Brand(brandData);
        return await brand.save();
    }
    

    static async updateBrand(name, updateData, logoPath) {
        const brand = await Brand.findOne({ name });

        if (!brand) {
            throw new Error('Brand information not found');
        }

        // Update fields, including logo if provided
        Object.assign(brand, updateData);
        if (logoPath) {
            brand.logo = logoPath;
        }

        return await brand.save();
    }

    static async getBrand(name) {
        const brand = await Brand.findOne({ name });
    
        if (!brand) {
            throw new Error(`Brand with name '${name}' not found`);
        }
        return brand;
    }
    

    static async deleteField(field) {
        const brand = await Brand.findOne();

        if (!brand) {
            throw new Error('Brand information not found');
        }

        if (_.has(brand.toObject(), field)) {
            _.unset(brand, field);
            await brand.save();
            return `${field} deleted successfully`;
        } else {
            throw new Error(`Field '${field}' does not exist in brand`);
        }
    }
}

module.exports = brandService;
