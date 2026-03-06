// import express from "express";
// import { handleIVR } from "../controllers/ivr.controller.js";

// const router = express.Router();

// // Exotel will hit this endpoint
// router.post("/call", handleIVR);

// export default router;
// console.log("🔥 IVR ROUTES FILE LOADED");
import express from "express";
import { handleIncomingCall } from "../controllers/ivr.controller.js";

const router = express.Router();

router.post("/exotel", handleIncomingCall);

export default router;
