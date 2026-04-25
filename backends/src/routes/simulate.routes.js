
import express from "express";
import { handleLanguage, handleService } from "../controllers/simulate.controller.js";

const router = express.Router();
router.post("/language", handleLanguage);
router.post("/service", handleService);

export default router;