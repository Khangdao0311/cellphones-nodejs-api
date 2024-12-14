var bcryptjs = require("bcryptjs");

var userModel = require("../models/user");

module.exports = {
  getAll,
  getById,
  search,
  insert,
  cancel,
  update,
};

async function getAll() {
  try {
    const users = await userModel.find().sort({ _id: -1 });
    const data = users.map(
      (user) =>
        (user = {
          id: user._id,
          name: user.name,
          image: `http://localhost:8080/images/${user.image}`,
          email: user.email,
          phone: user.phone,
          gender: user.gender,
          dob: user.dob,
          username: user.username,
          password: user.password,
          role: user.role,
          status: user.status,
          address: user.address,
        })
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getById(id) {
  try {
    const user = await userModel.findById(id);
    const data = {
      id: user._id,
      name: user.name,
      image: `http://localhost:8080/images/${user.image}`,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      dob: user.dob,
      username: user.username,
      password: user.password,
      role: user.role,
      status: user.status,
      address: user.address,
    };
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function search(key, search) {
  try {
    const query = {
      [key]: {
        $regex: search,
        $options: "i",
      },
    };
    const users = await userModel.find(query);
    if (!users.length) throw new Error(`Không tìm thấy sản phẩm "${search}"`);
    const data = users.map(
      (user) =>
        (user = {
          id: user._id,
          name: user.name,
          image: user.image,
          email: user.email,
          phone: user.phone,
          gender: user.gender,
          dob: user.dob,
          username: user.username,
          password: user.password,
          role: user.role,
          status: user.status,
          address: user.address,
        })
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function insert(body) {
  try {
    const {
      username,
      password,
      name,
      email,
      phone,
      dob,
      gender,
      role,
      province,
      district,
      ward,
      description,
      image,
    } = body;

    var salt = bcryptjs.genSaltSync(10);
    var hash = bcryptjs.hashSync(password, salt);

    const userNew = new userModel({
      name,
      image,
      email,
      phone,
      gender: Number(gender),
      dob,
      username,
      password: hash,
      role: Number(role),
      status: 1,
      address: {
        province,
        district,
        ward,
        description,
      },
    });
    const result = await userNew.save();
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function cancel(id) {
  try {
    const result = userModel.findByIdAndDelete(id);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function update(id, body) {
  try {
    const user = await userModel.findById(id);
    if (!user) throw new Error("Không Tìm Thấy Người Dùng !");

    const {
      username,
      password,
      name,
      email,
      phone,
      dob,
      gender,
      role,
      province,
      district,
      ward,
      description,
      image,
      status,
    } = body;

    var salt = bcryptjs.genSaltSync(10);
    var hash = bcryptjs.hashSync(password, salt);

    const result = await userModel.findByIdAndUpdate(
      id,
      {
        name,
        image,
        email,
        phone,
        gender: Number(gender),
        dob,
        username,
        password: hash,
        role: Number(role),
        status: Number(status),
        address: {
          province,
          district,
          ward,
          description,
        },
      },
      { new: true }
    );
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
