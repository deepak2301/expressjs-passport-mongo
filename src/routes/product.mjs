import { Router } from "express";
import { isAuthenticated } from "../utils/middleware.mjs";
import Product from "../mongoose/schemas/products.mjs";

const router = Router();

router.get("/api/products", isAuthenticated, async (req, res) => {
  try {
    const products = await Product.find();
    return res.send(products);
  } catch (error) {
    return res.status(401).send({ message: "error fetching products" });
  }
});

router.post("/api/cart", isAuthenticated, async (req, res) => {
  const { body: item } = req;
  const newProduct = new Product(item);
  await newProduct.save();
  return res.send({ msg: "Item added to cart", item });
});

router.get("/api/cart", isAuthenticated, (req, res) => {
  return res.send(req.session.cart ?? []);
});

// DELETE route to remove item from session cart
router.delete("/api/cart/:itemId", isAuthenticated, async (req, res) => {
  const { itemId } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(itemId);
    if (!deletedProduct) return res.status(404).send({ msg: "Item not found" });

    //Removing the item from the session cart if it exists
    if (req.session.cart) {
      req.session.cart = req.session.cart.filter(
        (item) => item.id !== parseInt(itemId, 10)
      );
    }

    return res.status(200).send({ msg: "Item removed from the cart" });
  } catch (error) {
    return res.status(500).send({ msg: "Error deleting the item" });
  }
});

export default router;
