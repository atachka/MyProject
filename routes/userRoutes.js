const express = require('express');
const userController = require('../controllers/userController');
const cartController = require('../controllers/cartController');
const router = express.Router();


router
    .route('/signup')
    .post(cartController.createCart, userController.createUser);

router
    .route('/forgotPassword')
    .post(userController.forgotPassword);

router
    .route('/resetPassword/:token')
    .patch(userController.resetPassword);
router
    .route('/updateMyPassword')
    .patch(userController.protect, userController.updatePassword);
router
    .route('/login')
    .get(userController.getAllUsers)
    .post(userController.loginUser);

router
    .route("/updateMe")
    .patch(userController.protect, userController.updateMe)

module.exports = router;