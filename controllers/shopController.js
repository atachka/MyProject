const { Shop } = require('../models/shopModel');


exports.getAllShops = async (req, res) => {
    try {
        const shops = await Shop.find();
        res.status(201).json({
            status: 'success',
            body: {
                shops
            }
        });
    }
    catch (err) {
        res.status(401).json({
            status: 'failed',
            message: err
        });
    }
};

exports.createShop = async (req, res) => {
    try {
        const newShop = await Shop.create(req.body);
        res.status(201).json({
            status: 'success',
            body: {
                newShop
            }
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

exports.getShop = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id).populate({
            path: 'products',
            select: '-__v'
        });
        res.status(201).json({
            status: 'success',
            data: {
                shop
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

exports.addProductToShop = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);
        const newArr = [...shop.products, req.body.newProduct]
        const newShop = await Shop.findByIdAndUpdate(req.params.id, { "products": newArr }, { new: true });
        res.status(201).json({
            status: "success",
            body: newShop
        })
    }

    catch (err) {
        console.log(err)
        res.status(401).json({
            status: 'failed',
            message: err
        })
    }
};