const { Shop } = require("../models/shopModel");
const AWS = require("aws-sdk");
const fs = require("fs");
const AppError = require("../utils/appError");
const jpeg = require("jpeg-js");

const s3 = new AWS.S3();

exports.uploadFile = (req, res, next) => {
  try {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `images/${req.body.fileName}`,
      Body: req.body.fileContent,
    };

    s3.upload(params, function (err, data) {
      if (err) {
        throw err;
      }
    });
    res.status(200).json({
      status: "success",
      fileContent,
    });
  } catch (err) {
    next(new AppError(err, 401));
  }
};

exports.readFile = async (req, res, next) => {
  try {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `images/${req.body.fileName}`,
    };
    const file = await s3.getObject(params, function (err, data) {
      const dataBody = data.Body;
      res.status(200).json({
        status: "success",
        dataBody,
      });
    });
  } catch (err) {
    next(new AppError(err, 401));
  }
};

exports.getAllShops = async (req, res, next) => {
  try {
    const shops = await Shop.find().populate({
      path: "products",
      select: "-__v",
    });

    res.status(201).json({
      status: "success",
      body: {
        shops,
      },
    });
  } catch (err) {
    next(new AppError(err, 401));
  }
};

exports.createShop = async (req, res, next) => {
  try {
    const newShop = await Shop.create(req.body);
    res.status(201).json({
      status: "success",
      body: {
        newShop,
      },
    });
  } catch (err) {
    next(new AppError(err, 401));
  }
};

exports.getShop = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id).populate({
      path: "products",
      select: "-__v",
    });
    res.status(201).json({
      status: "success",
      data: {
        shop,
      },
    });
  } catch (err) {
    next(new AppError(err, 401));
  }
};

exports.addProductToShop = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id);
    const newArr = [...shop.products, req.body.newProduct];
    const newShop = await Shop.findByIdAndUpdate(
      req.params.id,
      { products: newArr },
      { new: true }
    );
    res.status(201).json({
      status: "success",
      body: newShop,
    });
  } catch (err) {
    next(new AppError(err, 401));
  }
};
