// import CallSession from "../models/callsession.js";
// import Token from "../models/token.js";
// import { addToQueue } from "../services/queue.services.js";
// import { sendSMS } from "../services/sms.services.js";

// let tokenCounter = 1;

// export const generateToken = async (req, res) => {
//   const { sessionId } = req.body;

//   const session = await CallSession.findById(sessionId);
//   if (!session) {
//     return res.status(404).json({ error: "Session not found" });
//   }

//   const tokenNumber = `A-${String(tokenCounter++).padStart(3, "0")}`;
//   const position = addToQueue();
//   const expectedTime = `${position * 5} minutes`;

//   await Token.create({
//     tokenNumber,
//     phoneNumber: session.phoneNumber,
//     position,
//     expectedTime
//   });

//   sendSMS(
//     session.phoneNumber,
//     `Your token ${tokenNumber}. Expected time: ${expectedTime}`
//   );

//   res.json({
//     tokenNumber,
//     position,
//     expectedTime,
//     voiceText: `Your token is ${tokenNumber}. Expected waiting time is ${expectedTime}.`
//   });
// };
import Session from "../models/session.models.js";
import Token from "../models/token.models.js";
import Queue from "../models/queue.models.js";
import { sendSMS } from "../services/sms.services.js";
import { buildVoiceResponse } from "../services/tts.services.js";

const PREFIX = { doctor: "D", lab: "L", pharmacy: "P", bank: "B", governmentoffice: "GO" };

// ── Generate token (called by IVR) ───────────────────────────────
export const generateToken = async (req, res) => {
  const callSid = req.query.callSid || req.body.CallSid;
  res.set("Content-Type", "text/xml");

  const session = await Session.findOne({ callSid });
  if (!session) {
    return res.send(buildVoiceResponse("Session not found. Please call again."));
  }

  const { phone, language, service } = session;

  let queue = await Queue.findOne({ service });
  if (!queue) queue = await Queue.create({ service });

  queue.counter += 1;
  await queue.save();

  const tokenNumber = `${PREFIX[service]}-${String(queue.counter).padStart(3, "0")}`;
  const position = queue.counter;
  const estimatedWaitMinutes = position * queue.avgServiceMinutes;

  await Token.create({ tokenNumber, phone, service, language, position, estimatedWaitMinutes });

  const smsMessage = language === "hindi"
    ? `Aapka token ${tokenNumber} hai. Estimated wait time ${estimatedWaitMinutes} minutes hai.`
    : `Your token is ${tokenNumber}. Estimated wait time is ${estimatedWaitMinutes} minutes.`;

  await sendSMS(phone, smsMessage);

  const voiceMessage = language === "hindi"
    ? `Aapka token number ${tokenNumber} hai. Aap number ${position} par hain queue mein. Expected wait time ${estimatedWaitMinutes} minutes hai. Dhanyavaad.`
    : `Your token number is ${tokenNumber}. You are number ${position} in the queue. Expected wait time is ${estimatedWaitMinutes} minutes. Thank you.`;

  return res.send(buildVoiceResponse(voiceMessage, language));
};

// ── Get all tokens (Admin Dashboard) ─────────────────────────────
export const getAllTokens = async (req, res) => {
  try {
    const tokens = await Token.find().sort({ createdAt: -1 });
    return res.json(tokens);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ── Update token status (Admin Dashboard) ────────────────────────
export const updateTokenStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["waiting", "serving", "done"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const token = await Token.findByIdAndUpdate(id, { status }, { new: true });
    if (!token) return res.status(404).json({ error: "Token not found" });

    return res.json(token);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};