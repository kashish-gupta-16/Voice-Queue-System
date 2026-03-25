// import CallSession from "../models/callsession.js";

// export const simulateLanguage = async (req, res) => {
//   const { sessionId, language } = req.body;

//   await CallSession.findByIdAndUpdate(sessionId, { language });

//   res.json({
//     message: "Language selected (IVR simulated)",
//     language
//   });
// };

// export const simulateService = async (req, res) => {
//   const { sessionId, service } = req.body;

//   await CallSession.findByIdAndUpdate(sessionId, { serviceType: service });

//   res.json({
//     message: "Service selected (IVR simulated)",
//     service
//   });
// };
import Session from "../models/session.models.js";
import { buildGatherResponse, buildVoiceResponse } from "../services/tts.services.js";

const SERVICE_MENU = {
  english: "Press 1 for Doctor. Press 2 for Lab. Press 3 for Pharmacy. Press 4 for Bank. Press 5 for Government Office.",
  hindi: "Doctor ke liye 1 dabayein. Lab ke liye 2 dabayein. Pharmacy ke liye 3 dabayein. Bank ke liye 4 dabayein. Government Office ke liye 5 dabayein.",
};

const SERVICES = { "1": "doctor", "2": "lab", "3": "pharmacy", "4": "Bank", "5": "Government Office" };
const LANGUAGES = { "1": "hindi", "2": "english" };

export const handleLanguage = async (req, res) => {
  const BASE = process.env.NGROK_URL;
  const { CallSid, Digits } = req.body;
  res.set("Content-Type", "text/xml");

  const language = LANGUAGES[Digits];
  if (!language) {
    return res.send(buildGatherResponse(
      "Invalid input. Press 1 for Hindi. Press 2 for English.",
      `${BASE}/simulate/language`
    ));
  }

  await Session.findOneAndUpdate({ callSid: CallSid }, { language, step: "service" });

  return res.send(buildGatherResponse(
    SERVICE_MENU[language],
    `${BASE}/simulate/service`,
    language
  ));
};

export const handleService = async (req, res) => {
  const BASE = process.env.NGROK_URL;
  const { CallSid, Digits } = req.body;
  res.set("Content-Type", "text/xml");

  const session = await Session.findOne({ callSid: CallSid });
  const service = SERVICES[Digits];

  if (!service) {
    return res.send(buildGatherResponse(
      SERVICE_MENU[session?.language || "english"],
      `${BASE}/simulate/service`,
      session?.language
    ));
  }

  await Session.findOneAndUpdate({ callSid: CallSid }, { service, step: "token" });

  return res.send(`<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Redirect method="POST">${BASE}/token/generate?callSid=${CallSid}</Redirect>
    </Response>
  `);
};