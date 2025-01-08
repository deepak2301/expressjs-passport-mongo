import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Product", productSchema);
