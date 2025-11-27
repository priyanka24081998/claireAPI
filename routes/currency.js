const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();


router.get("/convert", async (req, res) => {
  const { amount = 0, to = "USD" } = req.query;
  const apiKey = process.env.EXCHANGE_RATE_API_KEY; // Your API key

  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
    const rate = response.data.conversion_rates[to];
    if (!rate) throw new Error("Invalid currency code");

    const converted = Number(amount) * rate;
    res.json({ converted });
  } catch (error) {
    console.error("Currency conversion error:", error.message);
    res.json({ converted: Number(amount) }); // fallback
  }
});

module.exports = router;
