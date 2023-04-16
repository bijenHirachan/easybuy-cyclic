import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const getAllCategories = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page || 0);

  const PAGE_SIZE = 6;

  const total = await Category.countDocuments();

  const categories = await Category.find()
    .limit(PAGE_SIZE)
    .skip(PAGE_SIZE * page);

  return res.status(200).json({
    success: true,
    totalPages: Math.ceil(total / PAGE_SIZE),
    categories,
  });
});

export const createCategory = catchAsyncErrors(async (req, res, next) => {
  const { title } = req.body;

  if (!title) return next(new ErrorHandler("Title is required", 400));

  const categoryExist = await Category.findOne({ title });

  if (categoryExist)
    return next(new ErrorHandler("Category already exist", 400));

  const category = await Category.create({ title });

  return res.status(201).json({
    success: true,
    message: "Category created successfully",
    category,
  });
});

export const updateCategory = catchAsyncErrors(async (req, res, next) => {
  const { title } = req.body;

  if (!title) return next(new ErrorHandler("Title is required", 400));

  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) return next(new ErrorHandler("Category Not Found", 404));

  category.title = title;

  await category.save();

  return res.status(200).json({
    success: true,
    message: "Category updated successfully",
  });
});

export const deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) return next(new ErrorHandler("Category Not Found", 404));

  await category.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});

export const categoryProducts = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const page = parseInt(req.query.page || 0);

  const PAGE_SIZE = 6;

  const total = await Product.find({ category: id }).count();

  const products = await Product.find({
    category: id,
  })
    .limit(PAGE_SIZE)
    .skip(PAGE_SIZE * page);

  return res.status(200).json({
    success: true,
    totalPages: Math.ceil(total / PAGE_SIZE),
    products,
  });
});
