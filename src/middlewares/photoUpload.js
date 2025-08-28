const path = require("path");
const multer = require("multer");


const uploadPath = path.join(__dirname, "../uploads");

const photoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    if (file) {
      const uniqueName =
          Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
      cb(null, uniqueName);
    }
  },
});

const photoUpload = multer({
  storage: photoStorage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file format"), false);
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = photoUpload;
