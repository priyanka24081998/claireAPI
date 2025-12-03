import Favorite from "../model/favorite.js";

// ADD FAVORITE
export const addFavorite = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const existing = await Favorite.findOne({ userId, productId });
    if (existing) return res.json(existing);

    const fav = await Favorite.create({ userId, productId });
    res.json(fav);
  } catch (error) {
    res.status(500).json({ error: "Failed to add favorite" });
  }
};

// GET FAVORITES
export const getFavorites = async (req, res) => {
  const { userId } = req.params;
  const favs = await Favorite.find({ userId });
  res.json(favs);
};

// REMOVE FAVORITE
export const removeFavorite = async (req, res) => {
  const { userId, productId } = req.body;
  await Favorite.deleteOne({ userId, productId });
  res.json({ message: "Removed from favorites" });
};
