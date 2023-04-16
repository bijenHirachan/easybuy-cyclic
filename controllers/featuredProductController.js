import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { FeaturedProduct } from "../models/FeaturedProduct.js";
import { Product } from "../models/Product.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const getAllFeaturedProducts = catchAsyncErrors(
  async (req, res, next) => {
    const featProds = await FeaturedProduct.find().populate("product");

    return res.status(200).json({
      success: true,
      featuredProducts: featProds.map((fp) => fp.product),
    });
  }
);

export const createFeaturedProduct = catchAsyncErrors(
  async (req, res, next) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) return next(new ErrorHandler("Product Not Found", 400));

    const featuredProductCount = await FeaturedProduct.count();

    if (featuredProductCount >= 4)
      return next(
        new ErrorHandler("You can't add more than 4 featured products.")
      );

    const featuredProductExist = await FeaturedProduct.findOne({
      product: productId,
    });

    if (featuredProductExist)
      return next(new ErrorHandler("Product already exist", 400));

    const featuredProduct = await FeaturedProduct.create({
      product,
    });

    return res.status(201).json({
      success: true,
      message: "Featured product created",
      featuredProduct,
    });
  }
);

export const deleteFeaturedProduct = catchAsyncErrors(
  async (req, res, next) => {
    const { productId } = req.params;

    const featuredProduct = await FeaturedProduct.findOne({
      product: productId,
    });

    if (!featuredProduct)
      return next(new ErrorHandler("Featured Product Not Found", 400));

    await featuredProduct.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Featured product deleted",
    });
  }
);
