var express = require("express");
var router = express.Router();
const PC = require("../controller/productController");
const multer = require("multer");
const { verifyToken } = require("../middleware/authMiddleware");

// Use memoryStorage instead of diskStorage (better for Cloudinary)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = require("../config/multerConfig");

/* GET all products */
router.get("/", PC.viewProducts);
router.get("/:id",PC.viewProductsbyID)
/* CREATE a new product (Protected Route) */
router.post(
  "/createProduct",
  verifyToken, // Verify user first
  upload.fields([
    { name: "images", maxCount: 15 },
    { name: "videos", maxCount: 5 }
  ]),
  PC.createProduct
);


// router.post(
//   "/createProduct",
//   verifyToken, // Verify user first
//   upload.single('images'),
//   PC.createProduct
// );
/* DELETE a product by ID (Protected Route) */
router.delete("/deleteProduct/:id", verifyToken, PC.deleteProduct);

// Delete image from Cloudinary
router.delete("/product/image/:publicId", verifyToken, async (req, res) => {
  const { publicId } = req.params;

  try {
    await cloudinary.uploader.destroy(publicId);
    res.status(200).json({ message: "Image deleted from Cloudinary" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete image" });
  }
});

// Delete video from Cloudinary
router.delete("/product/video/:publicId", verifyToken, async (req, res) => {
  const { publicId } = req.params;

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
    res.status(200).json({ message: "Video deleted from Cloudinary" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete video" });
  }
});

/* UPDATE a product by ID (Protected Route) */
router.patch(
  "/updateProduct/:id",
  verifyToken, // Verify user first
  upload.fields([
    { name: "images", maxCount: 15 },
    { name: "videos", maxCount: 5 }
  ]),
  PC.updateProduct
);

router.post("/saveDraft", async (req, res) => {
  try {
    const data = req.body;

    // Ensure draft field is true
    data.draft = true;

    const product = await Product.create(data);
    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error("Save Draft Error:", err);
    res.status(500).json({ success: false, message: "Failed to save draft" });
  }
});

// UPDATE DRAFT
router.patch("/updateDraft/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body, 
      { new: true }
    );

    res.json({ message: "Draft updated", draft: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating draft", error: err });
  }
});

router.patch("/publish/:id", async (req, res) => {
  try {
    const publishedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { draft: false }, 
      { new: true }
    );

    res.json({ message: "Product published", product: publishedProduct });
  } catch (err) {
    res.status(500).json({ message: "Error publishing product", error: err });
  }
});

// GET ALL DRAFTS
router.get("/drafts", async (req, res) => {
  try {
    const drafts = await Product.find({ draft: true }).sort({ updatedAt: -1 });
    res.json(drafts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching drafts", error: err });
  }
});

router.get("/draft/:id", async (req, res) => {
  try {
    const draft = await Product.findById(req.params.id);
    if (!draft || !draft.draft) {
      return res.status(404).json({ message: "Draft not found" });
    }
    res.json(draft);
  } catch (err) {
    res.status(500).json({ message: "Error fetching draft", error: err });
  }
});
router.post("/upload", productController.uploadCSV);

module.exports = router;
