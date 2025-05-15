import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const prodcutSchema = new mongoose.Schema({
  title: { type: String, unique: true },
  description: { type: String, index: "text" },
  code: String,
  price: Number,
  status: Boolean,
  stock: Number,
  category: { type: String, index: true },
  thumbnails: { type: [String], default: [] },
  tags: Array,
  createdAt: { type: Date, default: Date.now },
});

prodcutSchema.plugin(paginate);

const Product = mongoose.model("Product", prodcutSchema);

export default Product;
