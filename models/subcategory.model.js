import mongoose from "mongoose";

const subCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
      minLength: [2, "too short subCategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
    },
    image: String,
    cloudinary_id: String,
  },
  { timestamps: true }
);

export const subCategoryModel = mongoose.model(
  "subCategory",
  subCategorySchema
);
