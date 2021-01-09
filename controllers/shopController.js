const { Shop } = require('../models/shopModel');
const AWS = require('aws-sdk');
const fs = require('fs');


const s3 = new AWS.S3

exports.uploadFile = (fileId, file) => {
    console.log('qna agi')
    // Read content from the file
    const fileContent = fs.readFileSync('qata.jpg');
    // Setting up S3 upload parameters
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: 'images/qata.jpg', // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function (err, data) {
        if (err) {
            throw err;
        }
    });
};
exports.readFile = async (fileName) => {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: 'images/qata.jpg', // File name you want to save as in S3
    };
    const file = await s3.getObject(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
    });
    console.log(file, 'failiii');
}

exports.getAllShops = async (req, res) => {
    try {
        const shops = await Shop.find().populate({
            path: 'products',
            select: '-__v'
        })

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