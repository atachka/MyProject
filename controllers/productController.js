const { Product } = require("../models/productModel");
const { queryBuilder, isObjectEmpty } = require("../utils/queryBuilder");

exports.createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        product: newProduct,
      },
    });
  } catch (err) {
    res.status(401).json({
      status: "failed",
      message: err,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 50;
    const skip = (page - 1) * limit;
    let limitedQuery = { ...req.query };
    delete limitedQuery.limit;
    delete limitedQuery.page;
    let query = isObjectEmpty(limitedQuery) ? {} : queryBuilder(limitedQuery);
    const products = await Product.find(query).skip(skip).limit(limit);

    res.status(201).json({
      status: "success",
      data: {
        products,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(201).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (err) {
    res.status(401).json({
      status: "failed",
      message: err,
    });
  }
};
