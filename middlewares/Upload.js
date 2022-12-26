const mkdirp = require("mkdirp");
const multer = require("multer");

const uploadImage = (type) => {
  // console.log(type);
  const made = mkdirp.sync(`./public/storage/uploads/${type}`);

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public/storage/uploads/${type}`); // setup chỗ cần lưu file
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname); // đặt lại tên cho file
    },
  });

  const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      const extensionImageList = [".png", ".jpg"];
      const extension = file.originalname.slice(-4);
      const check = extensionImageList.includes(extension);

      if (check) {
        cb(null, true);
      } else {
        cb(new Error("extension không hợp lệ !"));
      }
    },
  });

  return upload.single(type);
};

module.exports = {
  uploadImage,
};