const Order = require("../model/orderModel");
const fetch = require("node-fetch");
const axios = require("axios");

const PAYPAL_API_BASE = "https://api-m.sandbox.paypal.com";

// Generate PayPal Access Token
async function generateAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;

  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { products, total } = req.body; // products = [{_id, name, price, quantity, metal, size}]

    const accessToken = await generateAccessToken();

    const order = await axios({
      url: `${PAYPAL_API_BASE}/v2/checkout/orders`,
      method: "post",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      data: {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: total.toFixed(2),
              breakdown: {
                item_total: { currency_code: "USD", value: total.toFixed(2) },
              },
            },
            items: products.map((p) => ({
              name: p.name,
              unit_amount: { currency_code: "USD", value: p.price.toFixed(2) },
              quantity: p.quantity.toString(),
              sku: `${p._id}|${p.metal}|${p.size}`,
            })),
          },
        ],
        application_context: {
          brand_name: "Clairediamonds",
          landing_page: "LOGIN",
          user_action: "PAY_NOW",
          return_url: "https://www.clairediamonds.com/payment-success",
          cancel_url: "https://www.clairediamonds.com/payment-cancel",
        },
      },
    });

    // Save order in DB
    const newOrder = new Order({
      paypalOrderID: order.data.id,
      products: products.map((p) => ({
        productId: p._id,
        name: p.name,
        metal: p.metal,
        size: p.size,
        quantity: p.quantity,
        price: p.price,
      })),
      total,
      status: "CREATED",
    });

    await newOrder.save();

    res.json(order.data);
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// CAPTURE ORDER
exports.captureOrder = async (req, res) => {
  try {
    const { orderID } = req.body;
    const accessToken = await generateAccessToken();

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    // Update order status in DB
    const order = await Order.findOne({ paypalOrderID: orderID });
    if (order) {
      order.status = data.status || "CAPTURED";
      await order.save();
    }

    res.json(data);
  } catch (err) {
    console.error("CAPTURE ORDER ERROR:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to capture PayPal order" });
  }
};

// GET ORDER DETAILS
exports.getOrderDetails = async (req, res) => {
  try {
    const { orderID } = req.params;

    const order = await Order.findOne({ paypalOrderID: orderID });
    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json(order);
  } catch (err) {
    console.error("GET ORDER ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};
