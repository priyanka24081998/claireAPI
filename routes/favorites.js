const express = require("express");
const { addFavorite, getFavorites, removeFavorite } =
  require("../controller/favoritesController.js");

const router = express.Router();

router.post("/", addFavorite);
router.get("/:userId", getFavorites);
router.delete("/", removeFavorite);

module.exports = router;
