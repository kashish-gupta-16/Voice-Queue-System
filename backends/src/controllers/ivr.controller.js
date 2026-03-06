// export const handleIncomingCall = (req, res) => {
//   const digits = req.body.Digits;

//   if (!digits) {
//     return res.send(`
//       <Response>
//         <Gather numDigits="1" action="http:/localhost:8000/ivr/exotel" method="POST">
//           <Say>Press 1 for Hindi. Press 2 for English.</Say>
//         </Gather>
//       </Response>
//     `);
//   }

//   return res.send(`
//     <Response>
//       <Say>You pressed ${digits}</Say>
//     </Response>
//   `);
// };
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