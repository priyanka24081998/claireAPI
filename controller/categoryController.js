const CM = require('../model/categoryModel');

exports.createCategory = async (req, res) => {
  try {
    const data = req.body;
    await CM.create(data);

    res.status(201).json({
      status: 'success',
      message: 'Category created successfully',
      data: data
    });

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.viewCategory = async (req, res) => {
  try {
    const data = await CM.find();
    res.status(200).json({
      status: 'success',
      data: data,
    });

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const category = await CM.findByIdAndUpdate(id, data, {
      new: true, 
      runValidators: true
    });

    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Category updated successfully',
      data: category
    });

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await CM.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Category deleted successfully'
    });

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};
