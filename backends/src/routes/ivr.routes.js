
import express from "express";
import { handleIncomingCall } from "../controllers/ivr.controller.js";

const router = express.Router();

router.post("/exotel", handleIncomingCall);

export default router;
