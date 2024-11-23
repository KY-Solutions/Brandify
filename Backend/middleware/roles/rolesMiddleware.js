const UserService = require('../../features/users/services/userService');

function roleMiddleware(requiredRoles) {
    return async (req, res, next) => {
        try {
            const user = await UserService.findUserById(req.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if the user's role matches any of the required roles
            if (requiredRoles.includes(user.role)) {
                return next();
            } else {
                return res.status(403).json({ message: 'Access denied.' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Server error.' });
        }
    };
}

module.exports = roleMiddleware;
