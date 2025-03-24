const SM = require('../model/subCategoryModel');
const category = require('../model/categoryModel');

exports.createSubCategory = async (req, res) => {
  try {
    const data = req.body;
    await SM.create(data);

    res.status(201).json({
      status: 'success',
      message: 'SubCategory created successfully',
      data : data
    });

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.viewSubCategory = async (req, res) => {
  try {
    const data = await SM.find().populate("categoryId",'categoryName'); 

    res.status(200).json({
      status: 'success',
      data : data
    });

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const subCategory = await SM.findByIdAndUpdate(id, data, {
      new: true, // ✅ Return updated document
      runValidators: true
    });

    if (!subCategory) {
      return res.status(404).json({
        status: 'fail',
        message: 'SubCategory not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'SubCategory updated successfully',
      data: subCategory
    });

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const subCategory = await SM.findByIdAndDelete(id);
    if (!subCategory) {
      return res.status(404).json({
        status: 'fail',
        message: 'SubCategory not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'SubCategory deleted successfully' // ✅ Fixed message
    });

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};
