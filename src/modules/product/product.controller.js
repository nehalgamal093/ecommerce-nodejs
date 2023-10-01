import slugify from "slugify";
import { productModel } from "../../../models/product.model.js";
import { AppError } from "../../../utils/AppError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { ApiFeatures } from "../../../utils/ApiFeatures.js";
import cloudinary from "../../../config/cloudinary.js";
import { TotalApiFeatures } from "../../../utils/TotalApiFeatures.js";

const createProduct = catchAsyncError(async (req, res) => {
  // req.body.slug = slugify(req.body.title);
  // req.body.imgCover = req.files.imgCover[0].filename;
  // req.body.images = req.files.images.map((obj) => obj.filename);

  // let result = new productModel(req.body);
  // await result.save();
  // res.json({ message: "success", result });
  if (req.body.title || (req.files && req.files.length > 0)) {
    try {
      let images = null;

      if (req.files && req.files.length > 0) {
        images = [];

        for (const file of req.files) {
          const { path } = file;

          images.push({
            attachment_file: (await cloudinary.uploader.upload(path))
              .secure_url,
            cloudinary_id: (await cloudinary.uploader.upload(path)).public_id,
          });
        }
      }
      const newProduct = new productModel({
        title: req.body.title,
        slug: slugify(req.body.title),
        price: req.body.price,
        priceAfterDiscount: req.body.priceAfterDiscount,
        ratingAvg: req.body.ratingAvg,
        ratingCount: req.body.ratingCount,
        description: req.body.description,
        quantity: req.body.quantity,
        sold: req.body.sold,
        category: req.body.category,
        subCategory: req.body.subCategory,
        brand: req.body.brand,
        images: images,
      });
      const result = await newProduct.save();
      res.status(200).json({ success: "success", result });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(500).json({
      errors: {
        common: {
          msg: "Couldn't create product",
        },
      },
    });
  }
});

const getAllProducts = catchAsyncError(async (req, res) => {
  //build query
  let apiFeatures = new ApiFeatures(productModel.find(), req.query)
    .paginate()
    .fields()
    .filter()
    .sort()
    .search();
  let total = new TotalApiFeatures(productModel.find(), req.query)
    .fields()
    .filter()
    .sort()
    .search();
  const count = await productModel.count();
  //execute query
  let result = await apiFeatures.mongooseQuery;
  let totalResult = await total.totalQuery;
  let pagesPerPage = totalResult.length;
  res.json({
    pages: Math.ceil(count / 6),
    message: "success",
    page: apiFeatures.page,
    pagePerCategory: Math.ceil(pagesPerPage / 6),
    result,
  });
});

const getProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await productModel.findById(id);
  !result && next(new AppError(`Product not found ${req.originalUrl}`, 404));

  result && res.json({ message: "success", result });
});

const updateProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.name) req.body.slug = slugify(req.body.title);
  let result = await productModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  !result && next(new AppError(`Product not found ${req.originalUrl}`, 404));

  result && res.json({ message: "success", result });
});

const deleteProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let result = await productModel.findByIdAndDelete(id);
  !result && next(new AppError(`Product not found ${req.originalUrl}`, 404));

  result && res.json({ message: "success", result });
});

export {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProduct,
};
