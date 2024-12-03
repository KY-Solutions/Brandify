const brandService = require('../services/brandService');

class brandController {
    // Create a new brand or update if it exists
    static async createBrand(req, res) {
        try {
            const { name, description, contactInfo } = req.body;

            // Validation
            if (!name || !description) {
                return res.status(400).json({
                    success: false,
                    message: 'Name and description are required fields.',
                });
            }

            if (contactInfo && (!contactInfo.email || !contactInfo.phone)) {
                return res.status(400).json({
                    success: false,
                    message: 'Both email and phone are required in contactInfo if provided.',
                });
            }

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

    // Update an existing brand
    static async updateBrand(req, res) {
        try {
            const { name } = req.query;

            // Validation
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Brand name is required for updating.',
                });
            }
            const brand = await brandService.getBrand(name);

            if (!brand) {
                return res.status(404).json({
                    success: false,
                    message: 'Brand not found.',
                });
            }

            const files = req; // Access uploaded files
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

    // Get brand information by name
    static async getBrandInfo(req, res) {
        try {
            const { name }= req.query;

            // Validation
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Brand name is required.',
                });
            }

            const brand = await brandService.getBrand(name);

            if (!brand) {
                return res.status(404).json({
                    success: false,
                    message: 'Brand not found.',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Brand information fetched successfully',
                brand,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Error fetching brand information: ${error.message}`,
            });
        }
    }

    // Delete a specific field from a brand
    static async deleteBrandField(req, res) {
        try {
            const { field } = req.body;
            const { name } = req.query;

            // Validation
           if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Brand name is required.',
                });
            }
            if (!field) {
                return res.status(400).json({
                    success: false,
                    message: 'Field name is required for deletion.',
                });
            }
            const brand = await brandService.getBrand(name);

            if (!brand) {
                return res.status(404).json({
                    success: false,
                    message: 'Brand not found.',
                });
            }
            // Validation: Prevent deletion of protected fields
            const restrictedFields = ['name', 'description', 'contactInfo'];
            if (restrictedFields.includes(field)) {
                return res.status(400).json({
                success: false,
                message: `The field "${field}" cannot be deleted as it is a protected field.`,
            });
            }
            const message = await brandService.deleteField(field);

            res.status(200).json({
                success: true,
                message,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `Error deleting brand field: ${error.message}`,
            });
        }
    }
}

module.exports = brandController;
