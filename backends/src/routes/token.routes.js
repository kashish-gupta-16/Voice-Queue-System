import express from "express";
import { generateToken, getAllTokens, updateTokenStatus } from "../controllers/token.controller.js";

const router = express.Router();
router.post("/generate", generateToken);
router.get("/all", getAllTokens);              
router.patch("/:id/status", updateTokenStatus); 
export default router;
