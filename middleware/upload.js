const GridFsStorage = require("multer-gridfs-storage");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(20, (err, buf) => {
        if (err) {
          return reject({ ...err, errorField: file.fieldname });
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename,
          bucketName: process.env.MONGODB_BUCKET,
        };
        resolve(fileInfo);
      });
    });
  },
});

const fileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    return callback(
      new Error(`Do not support ${path.extname(file.originalname)}`),
      false
    );
  }
  callback(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
