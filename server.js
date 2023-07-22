import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import { dbConnection } from "./database/dbConnection.js";
import categoryRouter from "./src/modules/category/category.router.js";
import morgan from "morgan";
import { AppError } from "./utils/AppError.js";
import { globalErrorMiddleware } from "./src/middleware/globalErrorAsyncError.js";
import subCategoryRouter from "./src/modules/subcategory/subcategory.router.js";
import brandRouter from "./src/modules/brands/brand.router.js";
import productRouter from "./src/modules/product/product.router.js";
import userRouter from "./src/modules/user/user.router.js";
import authRouter from "./src/modules/auth/auth.router.js";
const app = express();
const port = 3000;

app.use(express.json());
if (process.env.MODE == "development") {
  app.use(morgan("dev"));
}
app.use(express.static("uploads"));
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subcategories", subCategoryRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use('/api/v1/auth',authRouter)
app.all("*", (req, res, next) => {
  next(new AppError(`can't find this route: ${req.originalUrl}`, 404));
});
app.get("/", (req, res) => {
  res.send("Hello world");
});

//Global error handling middleware
app.use(globalErrorMiddleware);

dbConnection();

app.listen(port, () => {
  console.log("Connected successfully");
});

process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection", err);
});
