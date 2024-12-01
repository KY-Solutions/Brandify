const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const asyncHandler = require('express-async-handler');
const roleMiddleware = require('../../../middleware/roles/rolesMiddleware');
const authMiddleware = require('../../../middleware/authentication/authMiddleware');
const upload = require('../../../middleware/fileUpload/fileUploadMiddleware');

router.post('/', authMiddleware, roleMiddleware(['admin']), upload.array('logo',1), asyncHandler(brandController.createBrand));
router.put('/', authMiddleware, roleMiddleware(['admin']), upload.array('logo',1), asyncHandler(brandController.updateBrand)); // Update Brand Info
router.get('/', asyncHandler(brandController.getBrandInfo));
router.delete('/', authMiddleware, roleMiddleware(['admin']), asyncHandler(brandController.deleteBrandField));

module.exports = router;
