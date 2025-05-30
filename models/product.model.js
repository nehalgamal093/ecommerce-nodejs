import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      unique: [true, "Product title is unique"],
      trim: true,
      required: [true, "Product title is required"],
      minLength: [2, "too short product name"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    price: {
      type: Number,
      required: [true, "product price required"],
      min: 0,
    },
    priceAfterDiscount: {
      type: Number,
      min: 0,
    },
    ratingAvg: {
      type: Number,
      min: [1, "rating average must be greater than 1"],
      max: [5, "rating average must be less than 1"],
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      minLength: [5, "too short product description"],
      maxLength: [300, "too long product description"],
      required: [true, "product description required"],
      trim: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
      required: [true, "product quantity required"],
    },
    sold: {
      type: Number,
      default: 0,
      min: 0,
    },
    // imgCover: String,
    // images: [String],
    images: [
      {
        attachment_file: String,
        cloudinary_id: String,
      },
    ],
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      required: [true, "product category required"],
    },
    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: "subCategory",
      required: [true, "product subcategory required"],
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "brand",
      required: [true, "product brand required"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
// productSchema.post("init", (doc) => {
//   doc.imgCover = process.env.BASE_URL + "/product/" + doc.imgCover;
//   doc.images = doc.images.map(
//     (path) => .env.BASE_URL + "/product/" + path
//   );
// });
productSchema.virtual("myReviews", {
  ref: "review",
  localField: "_id",
  foreignField: "product",
});
productSchema.pre(/^find/, function () {
  this.populate("myReviews");
});
export const productModel = mongoose.model("product", productSchema);
