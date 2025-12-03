import CartItem from "../model/cartItem.js";
import Product from "../model/productModel.js";

// ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const existing = await CartItem.findOne({ userId, productId });

    if (existing) {
      existing.quantity = quantity;
      await existing.save();
      const populated = await CartItem.findById(existing._id).lean();
      const product = await Product.findById(productId).lean();
      populated.product = product;
      return res.json(populated);
    }

    const newItem = await CartItem.create({ userId, productId, quantity });
    const populated = await CartItem.findById(newItem._id).lean();
    const product = await Product.findById(productId).lean();
    populated.product = product;

    res.json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

// GET CART
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await CartItem.find({ userId }).lean();

    const cartWithProducts = await Promise.all(
      cart.map(async (item) => {
        const product = await Product.findById(item.productId).lean();
        return { ...item, product };
      })
    );

    res.json(cartWithProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// REMOVE CART ITEM
export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    await CartItem.deleteOne({ userId, productId });
    res.json({ message: "Removed from cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove item" });
  }
};
