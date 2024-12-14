var jwt = require("jsonwebtoken");
const { login } = require("../controllers/auth");

module.exports = {
  authentication,
  authorization,
};

async function authentication(req, res, next) {
  try {
    // console.log(req.headers.authorization);

    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.status(401).json({ status: false, message: "Chưa xác thực" });
      }

      const decoded = jwt.decode(token);

      console.log(decoded);
      // if (!decoded || !decoded.exp) {
      if (!decoded) {
        throw new Error("Token không hợp lệ");
      }

      const expirationTime = decoded.exp * 1000;
      const currentTime = Date.now();

      console.log(token);
      if (currentTime > expirationTime) {
        return res.status(401).json({ status: false, message: "Chưa xác thực" });
      }

      jwt.verify(token, "jwtSecret", (error, data) => {
        if (error) {
          return res.status(403).json({ status: false, message: "Không có quyền truy cập" });
        }
        req.user = data.user;
        next();
      });
    } else {
      return res.status(401).json({ status: false, message: "Chưa xác thực" });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
}

async function authorization(req, res, next) {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(401).json({ status: false, message: "Chưa xác thực" });
      }

      const decoded = jwt.decode(token);

      if (!decoded) {
        throw new Error("Token không hợp");
      }

      const expirationTime = decoded.exp * 1000;
      const currentTime = Date.now();

      if (currentTime > expirationTime) {
        return res.status(401).json({ status: false, message: "Chưa xác thực" });
      }

      jwt.verify(token, "jwtSecret", (error, data) => {
        if (error || !data.user.role) {
          return res.status(403).json({ status: false, message: "Không có quyền truy cập" });
        }

        req.user = data.user;
        next();
      });
    } else {
      return res.status(401).json({ status: false, message: "Chưa xác thực" });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: "Lỗi hệ thống" });
  }
}
