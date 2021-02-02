const express = require("express");
const app = express();
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const shopRouter = require("./routes/shopRoutes");
const cartRouter = require("./routes/cartRoutes");
const SwaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

app.use(express.json());
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/shop", shopRouter);
app.use("/cart", cartRouter);
app.use("/swagger", SwaggerUI.serve, SwaggerUI.setup(swaggerDocument));

module.exports = app;
