// export const sendSMS = (phone, message) => {
//   console.log("📩 SMS SENT");
//   console.log("To:", phone);
//   console.log("Message:", message);
// };
import axios from "axios";  // ← ADD THIS
import dotenv from "dotenv";
dotenv.config();

export const sendSMS = async (to, message) => {
  try {
    console.log("📤 Sending SMS to:", to);
    console.log("📝 Message:", message);
    console.log("🔑 Using SID:", process.env.EXOTEL_SID);
    console.log("🌐 Subdomain:", process.env.EXOTEL_SUBDOMAIN);

    const response = await axios.post(
      `https://${process.env.EXOTEL_API_KEY}:${process.env.EXOTEL_API_SECRET}@${process.env.EXOTEL_SUBDOMAIN}/v1/Accounts/${process.env.EXOTEL_SID}/Sms/send`,
      new URLSearchParams({
        From: process.env.EXOTEL_SENDER_ID,
        To: to,
        Body: message,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    console.log("✅ SMS sent:", response.data);
    return response.data;

  } catch (err) {
    console.error("❌ SMS failed:");
    console.error("Status:", err.response?.status);
    console.error("Error:", err.response?.data || err.message);
  }
};