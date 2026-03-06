// import express from "express";
// import { generateToken } from "../controllers/token.controller.js";

// const router = express.Router();

// router.post("/generate", generateToken);

// export default router;

import express from "express";
import { generateToken, getAllTokens, updateTokenStatus } from "../controllers/token.controller.js";

const router = express.Router();
router.post("/generate", generateToken);
router.get("/all", getAllTokens);               // ← ADD THIS
router.patch("/:id/status", updateTokenStatus); 
export default router;
