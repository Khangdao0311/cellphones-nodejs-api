var express = require("express");
var router = express.Router();

var productController = require("../controllers/product");
var { authentication, authorization } = require("../middleware/auth");

var multer = require("multer");
const product = require("../models/product");

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

router.get("/", async function (req, res, next) {
  try {
    const data = await productController.getAll();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

router.get("/query", async function (req, res, next) {
  try {
    const { search, id, categoryid, sale, price, orderby, page, limit } = req.query;
    const data = await productController.getQuery(
      search,
      id,
      categoryid,
      sale,
      price,
      orderby,
      page,
      limit
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

router.get("/totalpagesquery", async function (req, res, next) {
  try {
    const { search, categoryid, sale, price, limit } = req.query;
    const data = await productController.getTotalPagesQuery(search, categoryid, sale, price, limit);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

router.get("/same/:id/:limit", async function (req, res, next) {
  try {
    const { id, limit } = req.params;
    const data = await productController.getSame(id, limit);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const data = await productController.getById(id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

router.post("/", authorization, upload.array("images"), async function (req, res, next) {
  try {
    const body = req.body;
    body.images = req.files.map((file) => file.originalname);
    await productController.insert(body);
    return res.status(200).json({ status: true, message: "Thêm Thành công" });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

router.put("/:id", authorization, upload.array("images"), async function (req, res, next) {
  try {
    const { id } = req.params;
    const body = req.body;
    req.files.length
      ? (body.images = req.files.map((file) => file.originalname))
      : delete body.images;
    await productController.update(id, body);
    return res.status(200).json({ status: true, message: "Thêm Thành công" });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

router.delete("/:id", authorization, async function (req, res, next) {
  try {
    const { id } = req.params;
    await productController.cancel(id);
    return res.status(200).json({ status: true, message: "Xóa Thành công" });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

module.exports = router;
