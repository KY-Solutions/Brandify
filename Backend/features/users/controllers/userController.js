//* import packages
const UserService = require('../services/userService');
const bcrypt = require('bcrypt');
const tokenUtil = require('../../../utils/tokenUtil');
const User = require('../models/user');
const { sendEmail } = require('../../../utils/emailService');
const analytics = require('../../analytics/services/userAnalyticsService');
class UserController {
    //* [Method] controller method to register user and handle validation
    //* [201] created
    //* [400] bad request
    //* [500] internal server error

    static async register(req, res) {
        const { name, email, password } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validate that name and password are provided
        if (!name || !password || !email) {
            return res.status(400).json({ success: false, message: 'Name, Email and Password are required' });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }

        try {
            //* Check if the user already exists
            const existingUser = await UserService.findUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'User with this email already exists.' });
            }

            //* Create the new user
            const newUser = await UserService.createUser(name, email, password);
            //* generate the JWT 
            const token = tokenUtil.generateToken(newUser._id);
            //* request OTP from the service layer
            const emailOTP = await UserService.generateEmailOTP(email);
            //* send OTP to verify email
            await sendEmail(email, 'Email verification', `Your verification code is ${emailOTP}`);
            
            return res.status(201).json({ success: true, message: 'User created successfully.', token, data: [newUser.name, newUser.email, newUser._id] });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //* [Method] controller method to login user and handle password comparison
    //* [200] ok
    //* [401] unauthorized
    //* [500] internal server error

    static async login(req, res) {
        const { email, password } = req.body;

        try {
            const user = await UserService.findUserByEmail(email);
            // Check if user exists and if the password matches
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ success: false, message: 'Invalid email or password.' });
            }
            const token = tokenUtil.generateToken(user._id);
          
            const refreshToken = tokenUtil.generateRefreshToken(user._id);
            // store refresh token in Browser cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,

            })
            res.status(200).json({ success: true, message: 'Login successful.', token, data: user });
            analytics.logUserEvent(user, "USER_ACTION", { "eventType": "login" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //* [Method] controller method to find user by id
    //* [404] not found
    //* [500] internal server error

    static async findUser(req, res) {
        const userId = req.params.id;

        try {
            const user = await UserService.findUserById(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found.' });
            }
            res.json({ success: true, message: 'User found.', data: { user: newUser.name, email: newUser.email,id: newUser._id, isverified: newUser.isUserVerified } });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //* [Method] controller method to update user credentials using its id from the url
    //* [404] not found
    //* [500] internal server error

    static async updateUser(req, res) {
        const { name, password } = req.body;
        const userId = req.params.id;

        try {
            const updatedUser = await UserService.updateUser(userId, { name, password });
            if (!updatedUser) {
                return res.status(404).json({ success: false, message: 'User not found.' });
            }
            res.json({ success: true, data: { user: updatedUser.name, email: updatedUser.email,id: updatedUser._id, isverified: updatedUser.isUserVerified } });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //* [Method] controller method to delete user
    //* [404] not found
    //* [500] internal server error

    static async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            const deletedUser = await UserService.deleteUser(userId);
            if (!deletedUser) {
                return res.status(404).json({ success: false, message: 'User not found.' });
            }
            res.json({ success: true, message: 'User deleted successfully.' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    //* [Method] controller method to request password reset token
    //* [404] not found
    //* [200] ok
    //* [500] internal server error

    static async requestPasswordReset(req, res) {
        const { email } = req.body;
        try {
            const token = await UserService.generatePasswordResetToken(email);

            if (!token) {
                return res.status(404).json({ success: false, message: 'User not found.' });
            }
            //? consturct the password reset link
            const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${token}`;

            //? use the email services util
            await sendEmail(email, 'Password Reset Request', `You requested to reset your password. Click the following link to reset it: ${resetLink}. This link is valid for 1 hour.`);

            res.status(200).json({ success: true, message: 'Password reset token generated.', token });

        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    //* [Method] controller method reset the user password
    //* [400] bad request
    //* [200] ok
    //* [500] internal server error


    static async resetPassword(req, res) {
        const { newPassword } = req.body;
        const { token } = req.params;
        
        try {
            const user = await UserService.findUserByResetToken(token);
            if (!user) {
                return res.status(400).json({ success: false, message: 'Invalid or expired token.' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.passwordResetToken = null;
            user.passwordResetExpires = null;
            await user.save();

            res.status(200).json({ success: true, message: 'Password reset successful.' });

        } catch (error) {
            res.status(500).json({ success: false, message: error.message });

        }
    }
    //* [Method] controller method to get all users
    //* [200] ok
    //* [500] internal server error


    static async getUsers(req, res) {
        const { page = 1, limit = 10 } = req.query;
        try {
            const users = await UserService.getUsers(page, limit);
            const totalUsers = await User.countDocuments();
            res.status(200).json({ success: true, data: users, totalPages: Math.ceil(totalUsers / limit), currentPage: page });

        } catch (error) {
            res.status(500).json({ success: false, message: error.message });

        }
    }
    //* [Method] controller method to verify email verification OTP
    //* [400] bad request
    //* [408] expired
    //* [200] ok
    //* [500] internal server error


    static async verifyEmailOTP(req, res) {
        const { email, OTP } = req.body;
        try {
            const user = await UserService.findUserByEmail(email);
            if (OTP != user.userVerificationOTP) {
                res.status(400).json({ success: false, message: 'Incorrect verification code' });
            }
            if (OTP == user.userVerificationOTP && Date.now() > user.verificationOTPexpiresAt) {
                res.status(408).json({ success: false, message: 'verification Expired Please try again' });
            }

            user.userVerificationOTP = null;
            user.verificationOTPexpiresAt = null;
            user.isUserVerified = true;
            await user.save();

            res.status(200).json({ success: true, message: 'Email successfuly verified' });
            
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }

    }
    //* [Method] controller method to resend email verification OTP
    //* [200] ok
    //* [500] internal server error

    static async resendEmailVerificationOTP(req, res) {
        const { email } = req.body;

        try {
            const user = await UserService.findUserByEmail(email);
            if (user.isUserVerified) {
                return res.status(400).json({ success: false, message: 'Email already verified, please login' });
            }
            const emailOTP = await UserService.generateEmailOTP(email);
            sendEmail(email, 'Email verification', `Your verification code is ${emailOTP}`);
            res.status(200).json({ success: true, message: 'Email verification sent, please check your inbox' });


        } catch (error) {
            res.status(500).json({ success: false, message: error.message });

        }
    }

    static async refreshAccess(req, res) {
        const refreshToken = req.cookies.refreshToken;
        try {
            if (!refreshToken) {
                return res.status(404).json({ message: 'Refresh token is missing' });
            }
             
            // verify the refresh token 
            const decoded = tokenUtil.verifyRefreshToken(refreshToken);

            // generate a new access token
            const newAccessToken = tokenUtil.generateToken(decoded.id);

            res.status(200).json({ success: true, token: newAccessToken, });
        } catch (error) {
            res.status(401).json({ success: false, message: 'Invalid refresh token.' });
        }
    }

    static async logout(req, res) {
        try {
            res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            });
            res.status(200).json({ success: true, message: 'Logged out successfully.' });

        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to log out.' });

        }
    }

}

module.exports = UserController;
