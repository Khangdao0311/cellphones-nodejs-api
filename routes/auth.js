var express = require("express");
var jwt = require("jsonwebtoken");

var router = express.Router();

var authController = require("../controllers/auth");

var { authentication } = require("../middleware/auth");

router.post("/register", async function (req, res, next) {
  try {
    const { name, phone, email, username, password } = req.body;
    await authController.register({ name, phone, email, username, password });
    return res.status(200).json({ status: true, message: "Đăng ký thành công" });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

router.post("/login", async function (req, res, next) {
  try {
    const { account, password } = req.body;
    const access_token = await authController.login(account, password);
    return res.status(200).json(access_token);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

router.get("/logout/:username", async function (req, res, next) {
  try {
    const { username } = req.params;
    await authController.cancelRefreshToken(username);
    return res.status(200).json({ status: true, message: "Đăng xuất thành công" });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

router.post("/refreshtoken/", async function (req, res, next) {
  try {
    const { username } = req.body;
    const data = await authController.getRefreshToken(username);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

router.post("/newtoken", async function (req, res, next) {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(401).json({ status: false, message: "Chưa xác thực" });
    }

    const c = await authController.hasRefreshToken(refresh_token);

    if (!c) {
      return res.status(403).json({ status: false, message: "Không có quyền truy cập" });
    }

    jwt.verify(c.refresh_token, "jwtSecret", async (error, data) => {
      if (error) {
        return res.status(403).json({ status: false, message: "Không có quyền truy cập" });
      }

      const access_token = jwt.sign({ user: data.user }, "jwtSecret", {
        expiresIn: "10s",
      });

      return res.status(200).json(access_token);
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

router.get("/profile", authentication, async function (req, res, next) {
  try {
    console.log("token");
    const token = req.headers.authorization.split(" ")[1];

    const user = await authController.getProfile(token);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
});

module.exports = router;
