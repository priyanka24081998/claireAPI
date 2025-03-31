var express = require("express");
var router = express.Router();
const PC = require("../controller/productController");
const multer = require("multer");
const { verifyToken } = require("../middleware/authMiddleware");

// Use memoryStorage instead of diskStorage (better for Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/* GET all products */
router.get("/", PC.viewProducts);

/* CREATE a new product (Protected Route) */
router.post(
  "/createProduct",
  verifyToken, // Verify user first
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 3 }
  ]),
  PC.createProduct
);

/* DELETE a product by ID (Protected Route) */
router.delete("/deleteProduct/:id", verifyToken, PC.deleteProduct);

/* UPDATE a product by ID (Protected Route) */
router.patch(
  "/updateProduct/:id",
  verifyToken, // Verify user first
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 3 }
  ]),
  PC.updateProduct
);

module.exports = router;
