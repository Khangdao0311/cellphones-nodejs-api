const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const productSchema = new Schema({
  name: { type: String },
  images: [{ type: String }],
  price: { type: Number },
  types: [
    {
      name: { type: String },
      price_extra: { type: Number },
      price_sale: { type: Number },
      price_update: { type: Number },
      colors: [
        {
          name: { type: String },
          image: { type: String },
          price_extra: { type: Number },
          quantity: { type: Number },
        },
      ],
    },
  ],
  sale: { type: Boolean },
  rating: { type: Number },
  view: { type: Number },
  description: { type: String },
  category_id: { type: ObjectId, ref: "category" },
});

module.exports =
  mongoose.models.product || mongoose.model("product", productSchema);
