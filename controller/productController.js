const PM = require('../model/productModel');

exports.createProduct = async (req, res) => {

    const data = req.body;

    if (req.files?.images) {
      data.images = req.files.images.map(file => `${file.filename}`);
    }

    if (req.files?.videos) {
      data.videos = req.files.videos.map(file => `${file.filename}`);
    }

    try {
      await PM.create(data);
      res.status(201).json({
        status: 'success',
        message: 'Product created successfully',
        data : data
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message
      });
    }
  }



exports.viewProducts = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (id) {
        // Fetch a single product by ID
        const product = await PM.findById(id)
        .populate("categoryId", "categoryName")
      .populate("subCategoryId", "subCategoryName"); 
        if (!product) {
          return res.status(404).json({
            status: 'fail',
            message: 'Product not found'
          });
        }
        return res.status(200).json({
          status: 'success',
          data: product
        });
      } else {
        // Fetch all products
        const products = await PM.find()
        .populate("categoryId", "categoryName") 
      .populate("subCategoryId", "subCategoryName"); 
        res.status(200).json({
          status: 'success',
          results: products.length,
          data: products
        });
      }
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message
      });
    }
  };

  exports.deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
  
      const product = await PM.findByIdAndDelete(id);
      if (!product) {
        return res.status(404).json({
          status: 'fail',
          message: 'Product not found'
        });
      }
  
      res.status(200).json({
        status: 'success',
        message: 'Product deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message
      });
    }
  };

  exports.updateProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
  
      // ✅ Save new images if provided
      if (req.files?.images) {
        data.images = req.files.images.map(file => `${file.filename}`);
      }
  
      // ✅ Save new videos if provided
      if (req.files?.videos) {
        data.videos = req.files.videos.map(file => `${file.filename}`);
      }
  
      const product = await PM.findByIdAndUpdate(id, data, {
        new: true, // ✅ Return updated document
        runValidators: true
      });
  
      if (!product) {
        return res.status(404).json({
          status: 'fail',
          message: 'Product not found'
        });
      }
  
      res.status(200).json({
        status: 'success',
        message: 'Product updated successfully',
        data: product
      });
  
    } catch (error) {
      res.status(400).json({
        status: 'fail',
        message: error.message
      });
    }
  };
  
  
