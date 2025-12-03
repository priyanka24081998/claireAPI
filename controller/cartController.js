import CartItem from "../model/cartItem.js";

// ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const existing = await CartItem.findOne({ userId, productId });

    if (existing) {
      existing.quantity = quantity;
      await existing.save();
      return res.json(existing);
    }

    const newItem = await CartItem.create({ userId, productId, quantity });
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

// GET CART
export const getCart = async (req, res) => {
  const { userId } = req.params;
  const cart = await CartItem.find({ userId });
  res.json(cart);
};

// REMOVE CART ITEM
export const removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;
  await CartItem.deleteOne({ userId, productId });
  res.json({ message: "Removed from cart" });
};
