
const rateLimit = require('express-rate-limit');


const globalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, //? 1 min in milliseconds
    limit: 100, //? number of requests
    
});

const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 3,
    message: 'Too many login attempts, please try again later.',
});

const emailVerificationLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 5,
    message: 'Too many email verification attempts, please try again later.',
});

const passwordResetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 3,
    message: 'Too many password reset requests. Please try again later.',
    keyGenerator: (req) => {
        return req.body.email || 'Unkown';
    }
});

module.exports = {
    globalLimiter,
    loginLimiter,
    passwordResetLimiter,
    emailVerificationLimiter
};