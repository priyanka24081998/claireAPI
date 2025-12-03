import CartItem from "../model/cartItem.js";
import Product from "../model/productModel.js"; // Make sure this path is correct


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

  try {
    const cart = await CartItem.find({ userId });

    // Populate product details
    const cartWithProducts = await Promise.all(
      cart.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          _id: item._id,
          userId: item.userId,
          productId: item.productId,
          quantity: item.quantity,
          product: product
            ? {
                name: product.name,
                price: product.price,
                image: product.image, // make sure your product model has `image` field
                metal: product.metal, // if you have metal
              }
            : {
                name: "Unknown Product",
                price: 0,
                image: "/placeholder.png",
                metal: "Unknown",
              },
        };
      })
    );

    res.json(cartWithProducts);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// REMOVE CART ITEM
export const removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;
  await CartItem.deleteOne({ userId, productId });
  res.json({ message: "Removed from cart" });
};
