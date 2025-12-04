import Favorite from "../model/favorite.js";
import Product from "../model/productModel.js";

// ADD FAVORITE
export const addFavorite = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: "userId and productId required" });
    }

    // Check if already added
    const existing = await Favorite.findOne({ userId, productId });

    if (existing) {
      const populated = existing.toObject();
      populated.product = await Product.findById(productId).lean();
      return res.json(populated);
    }

    // Create new favorite
    const fav = await Favorite.create({ userId, productId });
    const populatedFav = fav.toObject();
    populatedFav.product = await Product.findById(productId).lean();

    res.json(populatedFav);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add favorite" });
  }
};

// GET FAVORITES
export const getFavorites = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("USER ID from FE:", userId);

    const favs = await Favorite.find({ userId }).lean();
    console.log("FOUND FAVORITES:", favs);

     const favorites = await Favorite.find({ userId })
      .populate("productId") // loads product automatically
      .lean();

    const formatted = favorites.map(fav => ({
      _id: fav._id,
      productId: fav.productId._id,
      product: fav.productId
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
};

// REMOVE FAVORITE
export const removeFavorite = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    await Favorite.deleteOne({ userId, productId });

    res.json({ message: "Removed from favorites" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove favorite" });
  }
};
