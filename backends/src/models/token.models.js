
import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  tokenNumber: { type: String, required: true }, // e.g. "A-017"
  phone: { type: String, required: true },
  service: { type: String, required: true },
  language: { type: String, required: true },
  status: { type: String, default: "waiting" }, // waiting | serving | done
  position: { type: Number },
  estimatedWaitMinutes: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Token", tokenSchema);