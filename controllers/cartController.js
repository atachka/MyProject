const { Cart } = require('../models/cartModel');
const util = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const { User } = require('../models/userModel');



exports.createCart = async (req, res, next) => {
    try {
        const newCart = await Cart.create(req.body);
        req.cart = newCart._id;
        console.log(newCart, 'niukarti')
        next()
    }
    catch (err) {
        console.log(err)
        res.status(401).json({
            status: 'failed',
            message: err
        });
    }

};




exports.getCarts = async (req, res) => {
    try {
        const carts = await Cart.find().populate({
            path: 'cartItems'
        });
        res.status(201).json({
            status: 'success',
            body: carts
        });
    }
    catch (err) {
        console.log(err)
        res.status(401).json({
            status: 'failed',
            message: err
        });
    }
};

exports.checkCart = async (req, res, next) => {

    if (req.user.cart === req.params.id) {
        return next()
    }
    else {
        return next(new AppError('this cart is wrong', 401))
    }


};



exports.addToCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);
        const newArr = [...cart.cartItems, req.body.newItem];
        const newCart = await Cart.findByIdAndUpdate(req.params.id, { "cartItems": newArr }, { new: true });
        res.status(201).json({
            status: 'success',
            body: newCart
        });
    }
    catch (err) {
        console.log(err)
        res.status(401).json({
            status: 'failed',
            message: err
        });
    }
};