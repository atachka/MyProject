const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'please provide an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please give us a valid email']
    },
    password: {
        type: String,
        required: [true, 'please provide a password'],
        minlength: 8,

    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: "user"
    },
    passwordConfirm: {
        type: String,
        required: [true, 'please confirm your password'],
        validate: {
            validator: function (el) {
                return el === this.password;
            }
        }
    },
    cart: String,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
});


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next()
});
userSchema.methods.changedPasswordAfter = function (JWTTimestap) {
    if (this.passwordChangedAt) {

    }

    return false;
}
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
};
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 10000;
    return resetToken;
};

exports.User = mongoose.model('User', userSchema);