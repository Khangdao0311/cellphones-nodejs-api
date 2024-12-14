var express = require("express");
var router = express.Router();

var categoryController = require("../controllers/category");
var { authentication, authorization } = require("../middleware/auth");

router.get("/", async function (req, res, next) {
  try {
    const data = await categoryController.getAll();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

router.get("/hasproduct", async function (req, res, next) {
  try {
    const data = await categoryController.getCategoryhasProduct();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

router.get("/query", async function (req, res, next) {
  try {
    console.log(req.query);
    
    const data = await categoryController.getQuery(req.query);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

router.get("/totalpagesquery", async function (req, res, next) {
  try {
    const data = await categoryController.getTotalPagesQuery(req.query);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const data = await categoryController.getById(id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

// router.get("/page/:page/:limit", async function (req, res, next) {
//   try {
//     const { page, limit } = req.params;
//     const data = await categoryController.getByPage(page, limit);
//     return res.status(200).json(data);
//   } catch (error) {
//     return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
//   }
// });

// router.get("/totalpages/:limit", async function (req, res, next) {
//   try {
//     const { limit } = req.params;
//     const data = await categoryController.getTotalPages(limit);
//     return res.status(200).json(data);
//   } catch (error) {
//     return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
//   }
// });

// router.get("/search/:search/:page/:limit", async function (req, res, next) {
//   try {
//     const { search, page, limit } = req.params;
//     const data = await categoryController.getSearch(search, page, limit);
//     return res.status(200).json(data);
//   } catch (error) {
//     return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
//   }
// });

// router.get("/totalpagessearch/:search/:limit", async function (req, res, next) {
//   try {
//     const { search, limit } = req.params;
//     const data = await categoryController.getTotalPagesSearch(search, limit);
//     return res.status(200).json(data);
//   } catch (error) {
//     return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
//   }
// });

router.post("/", authorization, async function (req, res, next) {
  try {
    const { name } = req.body;
    await categoryController.insert({ name });
    return res.status(200).json({ status: true, message: "Thêm Thành công" });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

router.put("/:id", authorization, async function (req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    await categoryController.update(id, { name });
    return res.status(200).json({ status: true, message: "Sửa Thành công" });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

router.delete("/:id", authorization, async function (req, res, next) {
  try {
    const { id } = req.params;
    await categoryController.cancel(id);
    return res.status(200).json({ status: true, message: "Xóa Thành công" });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

module.exports = router;
