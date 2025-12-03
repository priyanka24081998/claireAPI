import CartItem from "../model/cartItem.js";
import Product from "../model/Product.js";

// ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity, selectedMetal } = req.body;

    if (!selectedMetal) {
      return res.status(400).json({ error: "Selected metal is required" });
    }

    // Check if same product + metal already exists
    const existing = await CartItem.findOne({ userId, productId, selectedMetal });

    if (existing) {
      existing.quantity = quantity;
      await existing.save();

      const populated = await CartItem.findById(existing._id).lean();
      populated.product = await Product.findById(productId).lean();
      return res.json(populated);
    }

    const newItem = await CartItem.create({ userId, productId, quantity, selectedMetal });
    const populated = await CartItem.findById(newItem._id).lean();
    populated.product = await Product.findById(productId).lean();

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

    // Populate product for each cart item
    const populatedCart = await Promise.all(
      cart.map(async (item) => {
        const product = await Product.findById(item.productId).lean();
        return { ...item, product };
      })
    );

    res.json(populatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// REMOVE CART ITEM
export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId, selectedMetal } = req.body;
    await CartItem.deleteOne({ userId, productId, selectedMetal });
    res.json({ message: "Removed from cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove item" });
  }
};
