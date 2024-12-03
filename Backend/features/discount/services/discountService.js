const DiscountCode = require('../models/discount');

class DiscountCodeService {
    static async createDiscount(discountData) {
        const discount = new DiscountCode(discountData);
        return await discount.save();
    }

    static async findDiscountBycode(discountCode) {
        const discount =  DiscountCode.findOne({ code: discountCode, isActive: true });
        return await discount;
    }

    static async getActiveDiscounts(page = 1, limit = 10) {
        const discounts = DiscountCode.find({ isActive: true, expirationDate: { $gte: Date.now() } }).sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        return await discounts;
    }

    static async deactivateDiscount(discountCode) {
        const discount = DiscountCode.findOneAndUpdate({ code: discountCode }, { isActive: false }, { new: true });
        return await discount;
    }
    static async deleteDiscount(discountCode) {
        const discount = DiscountCode.findOneAndDelete({ code: discountCode });
        return await discount;
    }
}

module.exports = DiscountCodeService;