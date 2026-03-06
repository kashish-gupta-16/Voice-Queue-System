// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";

// import ivrRoutes from "./routes/ivr.routes.js";
// import simulateRoutes from "./routes/simulate.routes.js";
// import tokenRoutes from "./routes/token.routes.js";

// dotenv.config();

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ✅ Root Route (Fix for "Cannot GET /")
// app.get("/", (req, res) => {
//   res.send("🚀 Voice Queue System Backend is Running");
// });

// // Database Connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch(err => console.error("❌ MongoDB error:", err));

// // Routes
// app.use("/ivr", ivrRoutes);
// app.use("/simulate", simulateRoutes);
// app.use("/token", tokenRoutes);
// // app.post("/ivr/exotel", (req, res) => {
// //   res.send("DIRECT SERVER ROUTE WORKING");
// // });

// // ✅ Fallback 404 handler (optional but professional)
// /*app.use((req, res) => {
//   res.status(404).json({ error: "Route not found" });
// });*/

// // Start Server
// const PORT = process.env.PORT || 8000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// ✅ Fix: Always find .env relative to this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env") });

// ✅ Debug: confirm it's loading
console.log("NGROK_URL:", process.env.NGROK_URL);

import ivrRoutes from "./routes/ivr.routes.js";
import simulateRoutes from "./routes/simulate.routes.js";
import tokenRoutes from "./routes/token.routes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:3000"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("🚀 Voice Queue System Backend is Running");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

app.use("/ivr", ivrRoutes);
app.use("/simulate", simulateRoutes);
app.use("/token", tokenRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});