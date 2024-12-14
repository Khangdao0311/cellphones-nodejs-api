var express = require("express");
var jwt = require("jsonwebtoken");

var router = express.Router();

var userController = require("../controllers/user");
var { authentication, authorization } = require("../middleware/auth");

var multer = require("multer");

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

// router.get("/", authorization, async function (req, res, next) {
//   try {
//     const data = await userController.getAll();
//     return res.status(200).json(data);
//   } catch (error) {
//     return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
//   }
// });

// router.get("/:id", authentication, async function (req, res, next) {
//   try {
//     const { id } = req.params;
//     const data = await userController.getById(id);
//     return res.status(200).json(data);
//   } catch (error) {
//     return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
//   }
// });

router.post("/", authorization, upload.single("image"), async function (req, res, next) {
  try {
    const body = req.body;
    body.image = req.file.originalname;
    const result = await userController.insert(body);
    return res.status(200).json({ status: true, message: "Thêm Thành công", result });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

router.put("/:id", authorization, upload.single("image"), async function (req, res, next) {
  try {
    const { id } = req.params;
    const body = req.body;
    req.file ? (body.image = req.file.originalname) : delete body.image;
    const result = await userController.update(id, body);
    return res.status(200).json({ status: true, message: "Sửa Thành công" });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

router.delete("/:id", authorization, async function (req, res, next) {
  try {
    const { id } = req.params;
    const result = await userController.cancel(id);
    return res.status(200).json({ status: true, message: "Xóa Thành công", result: result });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});


module.exports = router;
