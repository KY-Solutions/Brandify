//* import packages

const express = require('express');
const UserController = require('../controllers/userController');
const asyncHandler = require('express-async-handler');
const authMiddleware = require('../../../middleware/authentication/authMiddleware');
const roleMiddleware = require('../../../middleware/roles/rolesMiddleware');
const { loginLimiter, passwordResetLimiter, emailVerificationLimiter } = require('../../../middleware/rateLimiter/rateLimiter');

//* configure router
const router = express.Router();

//? Registration route
router.post('/register', asyncHandler(UserController.register));

//? Login route
router.post('/login',loginLimiter, asyncHandler(UserController.login));

//? Request Password reset route
router.post('/request-password-reset',passwordResetLimiter, asyncHandler(UserController.requestPasswordReset));

//? Reset password route
router.post('/reset-password/:token', asyncHandler(UserController.resetPassword));

//? Email verification routes
router.post('/verify-email', asyncHandler(UserController.verifyEmailOTP));
router.post('/resend-email-verification',emailVerificationLimiter, asyncHandler(UserController.resendEmailVerificationOTP));

//? Authenticated routes
router.get('/:id',authMiddleware, asyncHandler(UserController.findUser));
router.put('/:id',authMiddleware, asyncHandler(UserController.updateUser));
router.delete('/:id',authMiddleware, roleMiddleware('admin'), asyncHandler(UserController.deleteUser));
router.get('/',authMiddleware, roleMiddleware('admin'), asyncHandler(UserController.getUsers));

module.exports = router;
