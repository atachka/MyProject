const router = require('express').Router();
const productController = require('../controllers/productController');
const userController = require('../controllers/userController');

router
    .route('/')
    .get(userController.protect, productController.getAllProducts)
router
    .route('/createProduct')
    .post(userController.protect, userController.restrictTo('admin'), productController.createProduct);
router
    .route('/:id')
    .get(userController.protect, productController.getProduct);
module.exports = router;