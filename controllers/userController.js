const { User } = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const util = require('util');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');



const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj
};
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            data: {
                users
            }
        })
    }
    catch (err) {
        res.status(500).json({
            status: 'failed',
            message: err
        })
    }
};
exports.createUser = async (req, res) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            role: req.body.role,
            cart: req.cart
        });
        createSendToken(newUser, 201, res);
    }
    catch (err) {
        res.status(500).json({
            status: 'failed',
            message: err
        })
    }
};


exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400))
    }

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    }

    else {
        createSendToken(user, 201, res);
    }
};


exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You arent logged in', 401))
    }

    const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const confirmedUser = await User.findById(decoded.id);
    if (!confirmedUser) {
        return next(new AppError('User doesnt exist', 401))
    };
    confirmedUser.changedPasswordAfter(decoded.iat);
    req.user = confirmedUser;
    next();
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You dont have permission to do that', 403))
        }

        else {
            next()
        }
    }
};

exports.forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        next(new AppError('there is no user with this email address', 404))
    };
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const resetURL = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`;
    const message = `forgot your password ? submit a patch request with your new password and passwordConfirm to:
     ${resetURL}.\n if you did not forget your password, please ignore this email`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token(valid for 10 min)',
            message: message
        });
        res.status(200).json({
            status: 'success',
            message: 'token sent to email!'
        });
    }
    catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('There was an error sending the email', 500))
    }
};


exports.resetPassword = async (req, res, next) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
        if (!user) {
            return next(new AppError('Token is invalid', 400))
        }
        else {
            user.password = req.body.password;
            user.passwordConfirm = req.body.passwordConfirm;
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();

            createSendToken(user, 201, res);

        };
    }
    catch (err) {
        res.status(401).json({
            status: 'failed',
            message: err
        })
    };
};

exports.updatePassword = async (req, res, next) => {
    try {
        user = await User.findById(req.user.id).select('+password');
        if (!user.correctPassword(req.body.passwordCurrent, user.password)) {
            return next(new AppError('Your current password is wrong.', 401));
        }
        else {
            user.password = req.body.password;
            user.passwordConfirm = req.body.passwordConfirm;
            await user.save();
            createSendToken(user, 201, res);
        };
    }
    catch (err) {
        res.status(401).json({
            status: 'failed',
            message: err
        });
    };

};

exports.updateMe = async (req, res, next) => {
    try {
        if (req.body.password || req.body.passwordConfirm) {
            return next(new AppError('This route is not for password updates', 400))
        }
        else {
            const filteredBody = filterObj(req.body, 'name', 'email')
            const user = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true })
            res.status(200).json({
                status: 'success',
                data: {
                    user
                }
            });
        }
    }
    catch (err) {
        console.log(err)
        res.status(401).json({
            status: 'failed',
            message: err
        });
    }
};