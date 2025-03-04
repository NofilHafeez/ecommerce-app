const multer = require("multer");
const { upload } = require("../utils/cloudinary"); // Import Cloudinary storage setup

// ✅ Middleware for single file upload
const uploadSingle = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: "File upload failed", error: err.message });
    }
    next();
  });
};

module.exports = uploadSingle;