const SM = require('../model/slideImgModel');
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.addImg = async (req, res) => {
    try {
        const files = req.files.images;

        const uploadedUrls = await Promise.all(
            files.map(async (file) => {
                const upload = await cloudinary.uploader.upload(file.path, {
                    folder: 'sliders/',
                    public_id: file.filename,
                    resource_type: 'image',
                });
                return upload.secure_url;
            })
        );

        const newSlider = new SM({ images: uploadedUrls });
        const saved = await newSlider.save();

        res.status(201).json({ message: 'Images uploaded successfully', data: saved });
    } catch (err) {
        console.error('Upload Error:', err.message);
        res.status(500).json({ error: 'Failed to upload images' });
    }
};

exports.getAllImgs = async (req, res) => {
  try {
    const sliders = await SM.find();
    res.status(200).json({ data: sliders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};

exports.deleteImg = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await SM.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Slider not found' });
    }

    res.status(200).json({ message: 'Slider deleted', data: deleted });
  } catch (err) {
    console.error('Delete Error:', err.message);
    res.status(500).json({ error: 'Failed to delete slider' });
  }
};


exports.updateImg = async (req, res) => {
  const { id } = req.params;

  try {
    const files = req.files.images;

    const uploadedUrls = await Promise.all(
      files.map(async (file) => {
        const upload = await cloudinary.uploader.upload(file.path, {
          folder: 'sliders/',
          public_id: file.filename,
          resource_type: 'image',
        });
        return upload.secure_url;
      })
    );

    const updated = await SM.findByIdAndUpdate(
      id,
      { images: uploadedUrls },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Slider not found' });
    }

    res.status(200).json({ message: 'Images updated', data: updated });
  } catch (err) {
    console.error('Update Error:', err.message);
    res.status(500).json({ error: 'Failed to update images' });
  }
};
