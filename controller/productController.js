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
// exports.createProduct = async (req, res) => {
//   try {
//     const data = req.body;

//     const file = req.files.images
//     console.log("file ==> ",file);

//     const stData = file.map(async(file) => {
//       // console.log(file);
//           const upload = await cloudinary.uploader.upload(file.path , {
//       folder : 'claireimages/',
//       public_id : file.filename,
//       resource_type : 'image'
//     })
//     // console.log("check all ==> ",upload);

//     return  upload.secure_url
//     })

//       const uploadedUrls = await Promise.all(stData);
//     data.images = uploadedUrls.filter(url => url !== null); // Filter out failed uploads
//     console.log("All uploaded URLs:", data.images);

//     // console.log("all data.images ==> ",data.images);

//     // if (req.files?.videos) {
//     //   data.videos = req.files.videos.map((file) => file.filename);
//     // }

//     // ✅ Save product in DB
//     const product = await PM.create(data);

//     res.status(201).json({
//       status: "success",
//       message: "Product created successfully",
//       data: product,
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: "fail",
//       message: error.message,
//     });
//   }
// };

// ✅ Create Product
exports.createProduct = async (req, res) => {
  try {
    console.log("req.files", req.files);
    console.log("req.body", req.body);
    console.log(process.env.CLOUDINARY_CLOUD_NAME);

    const uploadedImages = await Promise.all(
  (req.files.images || [])
    .filter((file) => file.mimetype.startsWith("image/")) // only images
    .map(async (file) => {
      const safePath = file.path.replace(/\\/g, "/"); // WINDOWS FIX
      console.log("Uploading image:", safePath);

      const up = await cloudinary.uploader.upload(safePath, {
        folder: "claireimages/",
        resource_type: "image",
      });

      return up.secure_url;
    })
);

    const uploadedVideos = await Promise.all(
  (req.files.videos || [])
    .filter((file) => file.mimetype.startsWith("video/")) // only videos
    .map(async (file) => {
      const safePath = file.path.replace(/\\/g, "/"); // WINDOWS FIX
      console.log("Uploading video:", safePath);

      const up = await cloudinary.uploader.upload(safePath, {
        folder: "claireimages/",
        resource_type: "video",
      });

      return up.secure_url;
    })
);

    req.body.images = uploadedImages;
    req.body.videos = uploadedVideos;

    const product = await PM.create(req.body);
    console.log("Saved product:", product);
    res.status(201).json({ status: "success", data: product });
  } catch (err) {
    console.log("ERROR CREATING PRODUCT:", err);
    res.status(400).json({ status: "fail", message: err.message });
  }
};

// ✅ View Products (Single or All)
exports.viewProducts = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params.id);

    if (id) {
      // ✅ Get single product
      const product = await PM.findById(id)
        .populate("categoryId", "categoryName")
        .populate("subCategoryId", "subCategoryName");

      if (!product) {
        return res
          .status(404)
          .json({ status: "fail", message: "Product not found" });
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

exports.viewProductsbyID = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await PM.findById(id)
      .populate("categoryId", "categoryName")
      .populate("subCategoryId", "subCategoryName");
    if (!product) {
      return res
        .status(404)
        .json({ status: "fail", message: "Product not found" });
    }

    res.status(200).json({ status: "success", data: product });
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
      return res
        .status(404)
        .json({ status: "fail", message: "Product not found" });
    }

    res
      .status(200)
      .json({ status: "success", message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// ✅ Update Product
// exports.updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // ✅ Ensure product exists
//     const productExists = await PM.findById(id);
//     if (!productExists) {
//       return res
//         .status(404)
//         .json({ status: "fail", message: "Product not found" });
//     }

//     const data = req.body;

//     // ✅ Handle image upload if new image is provided
//     if (req.files?.images) {
//       const imageUploadPromises = req.files.images.map(async (file) => {
//         const result = await cloudinary.uploader.upload(file.path, {
//           folder: "claireimages/",
//           resource_type: "image",
//         });
//         return result.secure_url;
//       });

//       data.images = await Promise.all(imageUploadPromises);
//     }

//     // ✅ Handle additional files (videos)
//     if (req.files?.videos) {
//       data.videos = req.files.videos.map((file) => file.filename);
//     }

//     // ✅ Update product
//     const updatedProduct = await PM.findByIdAndUpdate(id, data, {
//       new: true,
//       runValidators: true,
//     });

//     res.status(200).json({
//       status: "success",
//       message: "Product updated successfully",
//       data: updatedProduct,
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: "fail",
//       message: error.message,
//     });
//   }
// };
  

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await PM.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const data = req.body;

    // Handle images
    let uploadedImages = [];
    if (req.files?.images) {
      uploadedImages = await Promise.all(
        req.files.images.map((file) =>
          cloudinary.uploader.upload(file.path, { folder: "claireimages/" }).then(u => u.secure_url)
        )
      );
    }
    // Merge with existingImages from frontend
    const finalImages = [...(data.existingImages || []), ...uploadedImages];

    // Handle videos
    let uploadedVideos = [];
    if (req.files?.videos) {
      uploadedVideos = await Promise.all(
        req.files.videos.map((file) =>
          cloudinary.uploader.upload(file.path, { folder: "claireimages/", resource_type: "video" }).then(u => u.secure_url)
        )
      );
    }
    const finalVideos = [...(data.existingVideos || []), ...uploadedVideos];

    // Update product
    const updatedProduct = await PM.findByIdAndUpdate(
      id,
      {
        ...data,
        images: finalImages,
        videos: finalVideos
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ status: "success", data: updatedProduct });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "fail", message: err.message });
  }
};