const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: String,
  avgTime: Number
});

module.exports = mongoose.model("Service", serviceSchema);
