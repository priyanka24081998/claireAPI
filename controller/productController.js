const cloudinary = require("cloudinary").v2;
const PM = require("../model/productModel");
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
    data.images = []; // ✅ Initialize images array

    if (req.files?.images) {
      for (const file of req.files.images) {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: "claireimages/",
          resource_type: "image",
        });

        data.images.push(uploadResult.secure_url); // ✅ Store Cloudinary URL
      }
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
    const { id } = req.params;

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

    // ✅ Ensure product exists
    const productExists = await PM.findById(id);
    if (!productExists) {
      return res.status(404).json({ status: "fail", message: "Product not found" });
    }

    const data = req.body;

    // ✅ Handle image upload if new image is provided
    if (req.files?.images) {
      const imageUploadPromises = req.files.images.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "claireimages/",
          resource_type: "image",
        });
        return result.secure_url;
      });

      data.images = await Promise.all(imageUploadPromises);
    }

    // ✅ Handle additional files (videos)
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
