const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "a shop must have a name!"],
  },
  image: {
    type: String,
  },
  location: {
    type: String,
    required: [true, "a shop must have a location"],
  },
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
  ],
});

exports.Shop = mongoose.model("Shop", shopSchema);
