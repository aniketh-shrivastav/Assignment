import Product from "../models/Product.js";
import { ApiError } from "../utils/ApiError.js";

const canAccessProduct = (product, user) => {
  if (user.role === "admin") {
    return true;
  }

  return product.owner.toString() === user._id.toString();
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create({ ...req.body, owner: req.user._id });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const listProducts = async (req, res, next) => {
  try {
    const query = req.user.role === "admin" ? {} : { owner: req.user._id };
    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const listAllProductsForAdmin = async (_req, res, next) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (!canAccessProduct(product, req.user)) {
      throw new ApiError(403, "Access denied to this product");
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (!canAccessProduct(product, req.user)) {
      throw new ApiError(403, "Access denied to this product");
    }

    Object.assign(product, req.body);
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (!canAccessProduct(product, req.user)) {
      throw new ApiError(403, "Access denied to this product");
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
