const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtpEmail = async (to, code) => {
  await resend.emails.send({
    from: "Rawafed Fintech <noreply@rawafedfintech.com>",
    to,
    subject: "Your Rawafed Fintech verification code",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#0d9488">Verify your email</h2>
        <p>Use the code below to complete your registration. It expires in <strong>10 minutes</strong>.</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#0d9488;margin:24px 0">${code}</div>
        <p style="color:#6b7280;font-size:14px">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
};

module.exports = { sendOtpEmail };
