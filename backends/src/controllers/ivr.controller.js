
import Session from "../models/session.models.js";
import { buildGatherResponse } from "../services/tts.services.js";

export const handleIncomingCall = async (req, res) => {
  const BASE = process.env.NGROK_URL;
  const { CallSid, From } = req.body;

  res.set("Content-Type", "text/xml");

  await Session.findOneAndUpdate(
    { callSid: CallSid },
    { callSid: CallSid, phone: From, step: "language" },
    { upsert: true, new: true }
  );

  return res.send(buildGatherResponse(
    "Welcome to our clinic. Press 1 for Hindi. Press 2 for English.",
    `${BASE}/simulate/language`,
  ));
};