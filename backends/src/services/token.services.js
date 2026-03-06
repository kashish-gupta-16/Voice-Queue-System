import Token from "../models/token.models.js";

const PREFIX = "A";
const START_NUMBER = 101;

export const generateTokenForCaller = async (phone) => {
  // Check existing active token
  const existing = await Token.findOne({
    phone,
    status: "WAITING",
  });

  if (existing) {
    return {
      alreadyExists: true,
      token: existing.tokenCode,
    };
  }

  // Get last token
  const lastToken = await Token.findOne().sort({ createdAt: -1 });

  let nextNumber = START_NUMBER;

  if (lastToken) {
    const lastNumber = parseInt(lastToken.tokenCode.split("-")[1]);
    nextNumber = lastNumber + 1;
  }

  const tokenCode = `${PREFIX}-${nextNumber}`;

  const newToken = await Token.create({
    phone,
    tokenCode,
  });

  return {
    alreadyExists: false,
    token: tokenCode,
  };
};
