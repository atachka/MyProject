const { Product } = require("../models/productModel");

exports.createProduct = async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                product: newProduct
            }
        })
    }
    catch (err) {
        res.status(401).json({
            status: 'failed',
            message: err
        })
    }
};


exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(201).json({
            status: 'success',
            data: {
                products
            }
        })
    }
    catch (err) {
        res.status(401).json({
            status: 'failed',
            message: err
        })
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(201).json({
            status: 'success',
            data: {
                product
            }
        })
    }
    catch (err) {
        res.status(401).json({
            status: 'failed',
            message: err
        })
    }
};

