const { ObjectId } = require("mongodb");

const productModel = require("../models/product");
const categoryModel = require("../models/category");

var fs = require("fs");

module.exports = {
  getAll,
  getById,
  getSame,
  getQuery,
  getTotalPagesQuery,
  insert,
  cancel,
  update,
};

async function getAll() {
  try {
    const products = await productModel.find().sort({ _id: -1 });
    const data = products.map((product) => ({
      id: product._id,
      name: product.name,
      images: product.images.map((image) => `http://localhost:8080/images/${image}`),
      price: product.price,
      types: product.types.map((type) => ({
        name: type.name,
        price_extra: type.price_extra,
        price_sale: type.price_sale,
        price_update: type.price_update,
        colors: type.colors.map((color) => ({
          name: color.name,
          image: `http://localhost:8080/images/${color.image}`,
          price_extra: color.price_extra,
          quantity: color.quantity,
        })),
      })),
      rating: product.rating,
      view: product.view,
      sale: product.sale,
      description: product.description,
      category_id: product.category_id,
    }));
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getById(id) {
  try {
    const product = await productModel.findById(id);
    const data = {
      id: product._id,
      name: product.name,
      images: product.images.map((image) => `http://localhost:8080/images/${image}`),
      price: product.price,
      types: product.types.map((type) => ({
        name: type.name,
        price_extra: type.price_extra,
        price_sale: type.price_sale,
        price_update: type.price_update,
        colors: type.colors.map((color) => ({
          name: color.name,
          image: `http://localhost:8080/images/${color.image}`,
          price_extra: color.price_extra,
          quantity: color.quantity,
        })),
      })),
      rating: product.rating,
      view: product.view,
      sale: product.sale,
      description: product.description,
      category_id: product.category_id,
    };
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getSame(id, limit) {
  try {
    const product = await productModel.findById(id);
    if (!product) throw new Error("Sản phẩm không tồn tại !");
    const category = await categoryModel.findById(product.category_id);
    const productsSame = await productModel
      .find({ category_id: category._id, _id: { $ne: product._id } })
      .sort({ _id: -1 })
      .limit(limit);
    const data = productsSame.map((product) => ({
      id: product._id,
      name: product.name,
      images: product.images.map((image) => `http://localhost:8080/images/${image}`),
      price: product.price,
      types: product.types.map((type) => ({
        name: type.name,
        price_extra: type.price_extra,
        price_sale: type.price_sale,
        price_update: type.price_update,
        colors: type.colors.map((color) => ({
          name: color.name,
          image: `http://localhost:8080/images/${color.image}`,
          price_extra: color.price_extra,
          quantity: color.quantity,
        })),
      })),
      rating: product.rating,
      view: product.view,
      sale: product.sale,
      description: product.description,
      category_id: product.category_id,
    }));
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getQuery(search, id, categoryid, sale, price, orderby, page = 1, limit = 5) {
  try {
    let matchCondition = {};

    if (search) {
      matchCondition.name = {
        $regex: search,
        $options: "i",
      };
    }
    
    if (id) {
      matchCondition._id = {
        $in: id.split("-").map((_id) => new ObjectId(_id)),
      };
    }
    if (categoryid) {
      matchCondition.category_id = {
        $in: categoryid.split("-").map((idCat) => new ObjectId(idCat)),
      };
    }

    if (sale) {
      matchCondition.sale = true;
    }

    if (price) {
      const [min, max] = price.split("-");
      matchCondition.finalPrice = {
        $gte: +min,
        $lte: +max,
      };
    }

    let sortCondition = {};

    if (orderby) {
      const [sort, so] = orderby.split("-");
      sortCondition[sort] = so == "desc" ? -1 : 1;
    } else {
      sortCondition._id = -1;
    }
   

    const skip = (page - 1) * limit;

    const pipeline = [
      {
        $addFields: {
          finalPrice: {
            $subtract: [
              { $add: ["$price", { $arrayElemAt: ["$types.price_extra", 0] }] },
              { $arrayElemAt: ["$types.price_sale", 0] },
            ],
          },
        },
      },
      { $match: matchCondition },
      { $sort: sortCondition },
      { $skip: skip },
      { $limit: +limit },
    ];

    const products = await productModel.aggregate(pipeline);

    const data = products.map((product) => ({
      id: product._id,
      name: product.name,
      images: product.images.map((image) => `http://localhost:8080/images/${image}`),
      price: product.price,
      types: product.types.map((type) => ({
        name: type.name,
        price_extra: type.price_extra,
        price_sale: type.price_sale,
        price_update: type.price_update,
        colors: type.colors.map((color) => ({
          name: color.name,
          image: `http://localhost:8080/images/${color.image}`,
          price_extra: color.price_extra,
          quantity: color.quantity,
        })),
      })),
      rating: product.rating,
      view: product.view,
      sale: product.sale,
      description: product.description,
      category_id: product.category_id,
    }));
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getTotalPagesQuery(search, categoryid, sale, price, limit = 5) {
  try {
    let matchCondition = {};

    if (search) {
      matchCondition.name = {
        $regex: search,
        $options: "i",
      };
    }
    if (categoryid) {
      matchCondition.category_id = {
        $in: categoryid.split("-").map((idCat) => new ObjectId(idCat)),
      };
    }

    if (sale) {
      matchCondition.sale = true;
    }

    if (price) {
      const [min, max] = price.split("-");
      matchCondition.finalPrice = {
        $gte: +min,
        $lte: +max,
      };
    }

    let sortCondition = {};

    const pipeline = [
      {
        $addFields: {
          finalPrice: {
            $subtract: [
              { $add: ["$price", { $arrayElemAt: ["$types.price_extra", 0] }] },
              { $arrayElemAt: ["$types.price_sale", 0] },
            ],
          },
        },
      },
      { $match: matchCondition },
    ];

    const products = await productModel.aggregate(pipeline);

    const data = Math.ceil(products.length / limit);

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function insert(body) {
  try {
    const { name, images, price, types, sale, description, category_id } = body;
    const category = await categoryModel.findById(category_id);
    if (!category) throw new Error("không tìm thấy danh mục ");
    const productNew = new productModel({
      name: name,
      images: images,
      price: Number(price),
      types: JSON.parse(types),
      sale: !!sale,
      rating: 0,
      view: 0,
      description: description,
      category_id: category._id,
    });
    const result = await productNew.save();
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function update(id, body) {
  try {
    const product = await productModel.findById(id);
    if (!product) throw new Error("Không Tìm Thấy Sản Phẩm !");

    const { name, images, imagesOld, price, types, sale, description, category_id } = body;

    product.images.forEach((image) => {
      if (!JSON.parse(imagesOld).includes(image)) {
        fs.unlink(`./public/images/${image}`, function (err) {
          if (err) return console.log(err);
          console.log("file deleted successfully");
        });
      }
    });

    product.types.forEach((type, iType) => {
      type.colors.forEach((color, iColor) => {
        if (JSON.parse(types)[iType].colors[iColor].image !== color.image)
          fs.unlink(`./public/images/${color.image}`, function (err) {
            if (err) return console.log(err);
            console.log("file deleted successfully");
          });
      });
    });

    let categoryFind = null;
    if (category_id) {
      categoryFind = await categoryModel.findById(category_id);
      if (!categoryFind) throw new Error("không tìm thấy danh mục ");
    }
    const categoryUpdate = categoryFind ? categoryFind._id : product.category_id;

    const imagesNew = [];
    imagesNew.push(...JSON.parse(imagesOld));
    if (images) imagesNew.push(...images);

    const result = await productModel.findByIdAndUpdate(
      id,
      {
        name: name,
        images: imagesNew,
        price: Number(price),
        types: JSON.parse(types),
        sale: !!sale,
        rating: product.rating,
        view: product.view,
        description: description,
        category_id: categoryUpdate,
      },
      { new: true }
    );

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function cancel(id) {
  try {
    const product = await productModel.findById(id);
    if (!product) throw new Error("Sản phẩm không tồn tại !");
    product.images.forEach((image) => {
      fs.unlink(`./public/images/${image}`, function (err) {
        if (err) return console.log(err);
        console.log("file deleted successfully");
      });
    });
    product.types.forEach((type) => {
      type.colors.forEach((color) => {
        fs.unlink(`./public/images/${color.image}`, function (err) {
          if (err) return console.log(err);
          console.log("file deleted successfully");
        });
      });
    });
    const result = await productModel.findByIdAndDelete(id);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
