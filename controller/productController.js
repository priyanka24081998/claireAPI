const cloudinary = require("cloudinary").v2;
const PM = require("../model/productModel");
const storage = require("node-persist");
require("dotenv").config();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Create Product
exports.createProduct = async (req, res) => {
  try {
    const data = req.body;
    if (!req.file) {
      return res.status(400).json({ status: "fail", message: "Image file is required" });
    }

    // ✅ Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "claireimages/",
      resource_type: "image",
    });

    data.image = uploadResult.secure_url; // ✅ Save Cloudinary image URL in DB
    if (req.files?.images) {
      data.images = req.files.images.map((file) => file.filename);
    }
    if (req.files?.videos) {
      data.videos = req.files.videos.map((file) => file.filename);
    }
    const product = await PM.create(data);

    res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// ✅ View Products (Single or All)
exports.viewProducts = async (req, res) => {
  try {
    const  id  = req.params.id;

    if (id) {
      // ✅ Get single product
      const product = await PM.findById(id)
        .populate("categoryId", "categoryName")
        .populate("subCategoryId", "subCategoryName");

      if (!product) {
        return res.status(404).json({ status: "fail", message: "Product not found" });
      }

      return res.status(200).json({ status: "success", data: product });
    }

    // ✅ Get all products
    const products = await PM.find()
      .populate("categoryId", "categoryName")
      .populate("subCategoryId", "subCategoryName");

    res.status(200).json({
      status: "success",
      results: products.length,
      data: products,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// ✅ Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await PM.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ status: "fail", message: "Product not found" });
    }

    res.status(200).json({ status: "success", message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// ✅ Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    storage.initSync();
    
    const storedId = await storage.getItem("id");
    const productExists = await PM.findOne({ _id: id });

    if (!productExists) {
      return res.status(404).json({ status: "fail", message: "Product not found" });
    }

    if (storedId !== productExists.uid) {
      return res.status(403).json({ status: "fail", message: "Unauthorized to update this product" });
    }

    const data = req.body;

    // ✅ Handle image upload if new image is provided
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "claireimages/",
        resource_type: "image",
      });

      data.image = uploadResult.secure_url;
    }

    // ✅ Handle additional files (images/videos)
    if (req.files?.images) {
      data.images = req.files.images.map((file) => file.filename);
    }
    if (req.files?.videos) {
      data.videos = req.files.videos.map((file) => file.filename);
    }

    // ✅ Update product
    const updatedProduct = await PM.findByIdAndUpdate(id, data, { new: true, runValidators: true });

    res.status(200).json({
      status: "success",
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
