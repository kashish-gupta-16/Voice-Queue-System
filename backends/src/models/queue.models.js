import mongoose from "mongoose";

const queueSchema = new mongoose.Schema({
  service: { type: String, required: true }, // "doctor" | "lab" | "pharmacy"
  counter: { type: Number, default: 0 },     // total tokens issued
  avgServiceMinutes: { type: Number, default: 10 }, // avg time per person
});

export default mongoose.model("Queue", queueSchema);