// import mongoose from "mongoose";

// const callSessionSchema = new mongoose.Schema({
//   phoneNumber: String,
//   language: { type: String, default: null },
//   serviceType: { type: String, default: null },
//   status: { type: String, default: "STARTED" }
// }, { timestamps: true });

// export default mongoose.model("CallSession", callSessionSchema);
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  callSid: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  language: { type: String, default: null },   // "hindi" | "english"
  service: { type: String, default: null },    // "doctor" | "lab" | "pharmacy"
  step: { type: String, default: "language" }, // current IVR step
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Session", sessionSchema);