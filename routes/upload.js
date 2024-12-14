var express = require("express");
var router = express.Router();

var multer = require("multer");
var { authentication, authorization } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const checkfile = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|png|jpeg|web)$/)) {
    return cb(new Error("Bạn chỉ được upload file ảnh"));
  }
  return cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: checkfile });

router.post("/image", authentication, upload.single("image"), async function (req, res, next) {
  try {
    return res.status(200).json({ status: true, message: "Thành công" });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

router.post("/images", authentication, upload.array("images"), async function (req, res, next) {
  try {
    return res.status(200).json({ status: true, message: "Thành công" });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

module.exports = router;
