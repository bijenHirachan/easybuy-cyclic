import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";

export const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page || 0);

  const PAGE_SIZE = 6;

  const total = await Product.countDocuments();

  const products = await Product.find()
    .limit(PAGE_SIZE)
    .skip(PAGE_SIZE * page);

  res.status(200).json({
    success: true,
    totalPages: Math.ceil(total / PAGE_SIZE),
    products,
  });
});

export const searchProducts = catchAsyncErrors(async (req, res, next) => {
  const { search } = req.query;

  if (!search) return next(new ErrorHandler("Search is required", 404));
  const products = await Product.find({
    title: {
      $regex: search,
      $options: "i",
    },
  });

  res.status(200).json({
    success: true,
    products,
  });
});

export const createProduct = catchAsyncErrors(async (req, res, next) => {
  const { title, description, price, inStock, category } = req.body;

  const file = req.file;

  if (!title || !description || !price || !inStock || !file)
    return next(new ErrorHandler("All fields are required", 400));

  const fileUri = getDataUri(file);

  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
    folder: "/easybuy/products",
  });

  const selectedCategory = await Category.findById(category);

  const product = await Product.create({
    title,
    description,
    price,
    inStock,
    poster: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    category,
  });

  selectedCategory.products.push(product);

  await selectedCategory.save();

  res.status(201).json({
    success: true,
    message: "Product created successfully",
  });
});

export const getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  return res.status(200).json({
    success: true,
    product,
  });
});

export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, price, inStock, category } = req.body;

  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  if (title) product.title = title;
  if (description) product.description = description;
  if (price) product.price = price;
  if (inStock) product.inStock = inStock;
  if (category) {
    const selectedCategory = await Category.findById(category);
    if (selectedCategory) {
      product.category = category;
    }
    const productExist = selectedCategory.products.find(
      (pr) => pr._id.toString() === product._id.toString()
    );
    if (!productExist) {
      selectedCategory.products.push(product);
    }
    await selectedCategory.save();
  }

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
  });
});

export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  await cloudinary.v2.uploader.destroy(product.poster.public_id, {
    folder: "/easybuy/products",
  });

  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
