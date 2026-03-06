import express from "express";
import { exotelIVR } from "../controllers/ivr.controller.js";

const router = express.Router();

router.post("/ivr/exotel", exotelIVR);

export default router;
