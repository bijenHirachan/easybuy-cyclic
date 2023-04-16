import mongoose from "mongoose";

const featuredProductSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  {
    timestamps: true,
  }
);

export const FeaturedProduct = mongoose.model(
  "FeaturedProduct",
  featuredProductSchema
);
