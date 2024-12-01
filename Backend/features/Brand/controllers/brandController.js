const brandService = require('../services/brandService');

class brandController {
    static async createBrand(req, res) {
        try {
            const { files } = req; // Access uploaded files
            const logoPath = files && files[0] ? `/uploads/logos/${files[0].filename}` : null;

            const brandData = { ...req.body, logo: logoPath };
            const brand = await brandService.createOrUpdateBrand(brandData);

            res.status(201).json({
                success: true,
                message: 'Brand information created successfully',
                brand,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Error creating brand information: ${error.message}`,
            });
        }
    }

    static async updateBrand(req, res) {
        try {
            const { name } = req.query; // Extract brand name from query parameters
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Brand name is required for updating',
                });
            }
    
            const { files } = req; // Access uploaded files
            const logoPath = files && files[0] ? `/uploads/logos/${files[0].filename}` : null;

            const updatedBrand = await brandService.updateBrand(name, req.body, logoPath);

            
            res.status(200).json({
                success: true,
                message: 'Brand information updated successfully',
                brand: updatedBrand,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Error updating brand information: ${error.message}`,
            });
        }
    }

    static async getBrandInfo(req, res) {
        try {
            const { name } = req.query; // Extract brand name from query parameters
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Brand name is required',
                });
            }
    
            const brand = await brandService.getBrand(name);
    
            res.status(200).json({
                success: true,
                message: 'Brand information fetched successfully',
                brand,
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message,
            });
        }
    }
    

    static async deleteBrandField(req, res) {
        try {
            const { field } = req.body;
            const message = await brandService.deleteField(field);
            res.status(200).json({
                success: true,
                message,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}

module.exports = brandController;
