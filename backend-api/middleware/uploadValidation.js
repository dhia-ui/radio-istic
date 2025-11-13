const path = require('path');

/**
 * Validates uploaded files for security and correctness
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
const validateUpload = (req, res, next) => {
  // Check if file exists
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  // Validate MIME type
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedMimes.includes(req.file.mimetype)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.'
    });
  }

  // Check file extension matches MIME type (prevents spoofing)
  const ext = path.extname(req.file.originalname).toLowerCase();
  const mimeToExtension = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/jpg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp']
  };

  const validExtensions = mimeToExtension[req.file.mimetype];
  if (!validExtensions || !validExtensions.includes(ext)) {
    return res.status(400).json({
      success: false,
      message: 'File extension does not match file type. Possible file spoofing detected.'
    });
  }

  // Validate file size (5MB max - already handled by Multer but double-check)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (req.file.size > maxSize) {
    return res.status(400).json({
      success: false,
      message: 'File size exceeds 5MB limit'
    });
  }

  // Sanitize filename to prevent path traversal
  const sanitizedFilename = path.basename(req.file.filename);
  if (sanitizedFilename !== req.file.filename) {
    return res.status(400).json({
      success: false,
      message: 'Invalid filename detected'
    });
  }

  // All validations passed
  next();
};

module.exports = { validateUpload };
