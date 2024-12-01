const DiscountCode = require('../models/discount');
const DiscountCodeService = require('../services/discountService');


class DiscountCodeController {
    static async createDiscount(req, res) {
        const { code, percentage, maxDiscountAmount, minOrderAmount, expirationDate } = req.body;
        try {
            
            if (!code) {
                res.status(400).json({ message: 'Discount code is required' });
            }
            if (!percentage) {
                res.status(400).json({ message: 'Discount percentage is required' });
            }
            if (!expirationDate) {
                res.status(400).json({ message: 'Expiration date is required' });
    
            }
            if (percentage < 0 || percentage > 100) {
                res.status(400).json({ message: 'Percentage must be between 0 and 100' });
            }
            if (new Date(expirationDate) <= new Date()) {
            return res.status(400).json({ message: 'Expiration date must be in the future' });
            }
            const discount = await DiscountCodeService.createDiscount({
                code,
                percentage,
                maxDiscountAmount,
                minOrderAmount,
                expirationDate
            });
            res.status(201).json({ success: true, message: 'Discount successfully created', discount: discount });
        } catch (error){
            res.status(500).json({ message: error.message });
        }

    }

    static async findDiscountByCode(req, res) {
        const  discount  = req.params.code;
        try {
            const foundDiscount = await DiscountCodeService.findDiscountBycode(discount);
            if (!foundDiscount) {
                return res.status(404).json({ message: 'Discount not found' });
            }
            res.status(200).json({ success: true, message: `discount found`, discount: foundDiscount});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getActiveDiscount(req, res) {
        const { page = 1, limit = 10 } = req.query;
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        try {
            const activeDiscounts = await DiscountCodeService.getActiveDiscounts(pageNumber, limitNumber);
            const totalDiscounts = await DiscountCode.countDocuments({ isActive: true, expirationDate: { $gte: Date.now() } });
            res.status(200).json({ success: true, activeDiscounts: activeDiscounts, totalPages: Math.ceil(totalDiscounts / limitNumber), currentPage: pageNumber });
            
        } catch (error) {
            res.status(500).json({ message: error.message });
 
        }
    }

    static async deactivateDiscount(req, res) {
        const  discount  = req.params.code;
        try {
            const desiredDiscount = await DiscountCodeService.findDiscountBycode(discount);
            if (!desiredDiscount) {
                res.status(404).json({ message: `Discount code: ${desiredDiscount} not found` });
            }
            await DiscountCodeService.deactivateDiscount(desiredDiscount.code);
            res.status(200).json({ message: `Discount code: ${desiredDiscount.code} deactivated successfully` });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async deleteDiscount(req, res) {
        const  discount  = req.params.code;
        try {
            const desiredDiscount = await DiscountCodeService.findDiscountBycode(discount);
            if (!desiredDiscount) {
                res.status(404).json({ message: `Discount code: ${desiredDiscount} not found` });
            }
            await DiscountCodeService.deleteDiscount(desiredDiscount.code);
            res.status(200).json({ message: `Discount code: ${desiredDiscount.code} deleted successfully` });
            
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = DiscountCodeController;