const express = require('express');
const cartController = require('../controllers/cartController');
const userController = require('../controllers/userController');
const router = express.Router();




router
    .route('/')
    .get(userController.protect, cartController.getCarts);

router
    .route('/:id')
    .patch(userController.protect, cartController.checkCart, cartController.addToCart);

module.exports = router
