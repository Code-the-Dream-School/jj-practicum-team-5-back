
const multer = require('multer');
const { extname } = require('path');
const { randomUUID } = require('crypto');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/projects'),
  filename: (req, file, cb) => {
    const ext = extname(file.originalname || '').toLowerCase();
    cb(null, `${randomUUID()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  // allow common image types
  if (/^image\/(png|jpe?g|gif|webp)$/.test(file.mimetype)) return cb(null, true);
  cb(new Error('Only image files are allowed (png, jpg, jpeg, gif, webp).'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
