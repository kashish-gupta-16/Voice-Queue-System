// Generates Exotel-compatible XML <Say> response in the right language
export const buildVoiceResponse = (message, language = "english") => {
  const lang = language === "hindi" ? "hi-IN" : "en-IN";
  return `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say language="${lang}">${message}</Say>
    </Response>`;
};

export const buildGatherResponse = (message, action, language = "english") => {
  const lang = language === "hindi" ? "hi-IN" : "en-IN";
  return `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Gather numDigits="1" action="${action}" method="POST">
        <Say language="${lang}">${message}</Say>
      </Gather>
    </Response>`;
};