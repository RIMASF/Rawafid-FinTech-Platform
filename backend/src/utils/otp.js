const crypto = require("crypto");
const Otp = require("../models/Otp");

const generateOtp = () => crypto.randomInt(100000, 999999).toString();

const saveOtp = async (email, code) => {
  await Otp.deleteMany({ email });
  await Otp.create({
    email,
    code,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
  });
};

const verifyOtp = async (email, code) => {
  const otp = await Otp.findOne({ email });
  if (!otp) return "expired";
  if (otp.expiresAt < new Date()) {
    await otp.deleteOne();
    return "expired";
  }
  if (otp.code !== code) return "invalid";
  await otp.deleteOne();
  return "valid";
};

module.exports = { generateOtp, saveOtp, verifyOtp };
