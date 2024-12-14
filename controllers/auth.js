var bcryptjs = require("bcryptjs");
var jwt = require("jsonwebtoken");

var refreshTokenModel = require("../models/refreshToken");
var userModel = require("../models/user");

module.exports = {
  login,
  register,
  cancelRefreshToken,
  hasRefreshToken,
  getRefreshToken,
  getProfile,
};

async function login(account, password) {
  try {
    const user = await userModel.findOne({
      $or: [{ username: account }, { email: account }, { phone: account }],
    });

    if (user) {
      if (bcryptjs.compareSync(password, user.password)) {
        const data = {
          id: user._id,
          username: user.username,
          name: user.name,
          image: `http://localhost:8080/images/${user.image}`,
          dob: user.dob,
          email: user.email,
          gender: user.gender,
          phone: user.phone,
          role: user.role,
          status: user.status,
          address: user.address,
        };
        const access_token = jwt.sign({ user: data }, "jwtSecret", {
          expiresIn: "10s",
        });
        const refresh_token = jwt.sign({ user: data }, "jwtSecret");

        const refreshTokenNew = new refreshTokenModel({ username: user.username, refresh_token });
        await refreshTokenNew.save();

        return access_token;
      }
    }
    throw new Error("ĐĂNG NHẬP THẤT BẠI !!");
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function register(body) {
  try {
    const { name, phone, email, username, password } = body;

    const users = await userModel.find({
      $or: [{ username: username }, { email: email }, { phone: phone }],
    });

    if (users.length) {
      throw new Error("Trùng");
    }

    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(password, salt);

    const userNew = new userModel({
      name: name,
      image: "",
      email: email,
      phone: phone,
      gender: 1,
      dob: "",
      username: username,
      password: hash,
      role: 0,
      status: 1,
      address: {
        province: "",
        district: "",
        ward: "",
        description: "",
      },
    });
    const result = await userNew.save();
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// async function insertRefreshToken(user_id, refreshToken) {
//   try {
//     const user = await userModel.findById(user_id);
//     const refreshTokenData = await refreshTokenModel.deleteOne({
//       user_id: user.id,
//     });
//     // if (refreshTokenData) {
//     //   throw new Error("Tài Khoản này đã đăng nhập");
//     // }
//     const refreshTokenNew = new refreshTokenModel({ user_id, refreshToken });
//     const result = await refreshTokenNew.save();
//     return result;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }

async function cancelRefreshToken(username) {
  try {
    const result = await refreshTokenModel.deleteMany({
      username: username,
    });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function hasRefreshToken(refresh_token) {
  try {
    const refreshToken = await refreshTokenModel.findOne({
      refresh_token: refresh_token,
    });
    return refreshToken;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getRefreshToken(username) {
  try {
    const data = await refreshTokenModel.findOne({ username: username });

    if (!data) {
      throw new Error("Người dùng này chưa có refresh token !!");
    }
    return data.refresh_token;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getProfile(token) {
  try {
    return await jwt.verify(token, "jwtSecret", (error, data) => {
      if (error) {
        throw new Error("Không có quyền truy cập");
      }
      return data.user;
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
