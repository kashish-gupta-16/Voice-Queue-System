const Token = require("../models/token");

exports.getDashboardData = async (req, res) => {
  try {
    const tokens = await Token.find().sort({ createdAt: 1 });
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
