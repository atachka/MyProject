const express = require('express');
const shopController = require("../controllers/shopController");
const userController = require('../controllers/userController');
const router = express.Router();


router
    .route('/')
    .get(userController.protect, shopController.getAllShops);

router
    .route('/createShop')
    .post(userController.protect, userController.restrictTo('admin'), shopController.createShop);
router
    .route('/addProductToShop/:id')
    .put(userController.protect, userController.restrictTo('admin'), shopController.addProductToShop);
router
    .route('/:id')
    .get(userController.protect, shopController.getShop);


module.exports = router;