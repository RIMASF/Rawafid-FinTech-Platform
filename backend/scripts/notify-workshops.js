// Send workshop registration reminder to all verified users
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const profileSchema = new mongoose.Schema({ email: String, firstName: String, gender: String });
const Profile = mongoose.model("Profile", profileSchema, "profiles");

const SITE_URL = "https://rawafedfintech.com";

const buildHtml = (firstName) => `
  <div style="font-family:sans-serif;max-width:560px;margin:auto;direction:rtl;text-align:right">
    <h2 style="color:#0d9488">مرحبًا ${firstName}،</h2>
    <p>متحمسين جدًا لوجودك معنا، ونتطلع نشوفك بكرة بإذن الله 🤩</p>
    <p>كما نحب نذكّرك بأن يوم <strong>الثلاثاء ١٩ مايو</strong> سيتضمن مجموعة من ورش العمل والجلسات الحوارية المتنوعة، واللي بتكون فرصة جميلة للتعلّم، اكتساب المعرفة، والاستفادة من خبرات وتجارب مختلفة 👏🏼✨</p>
    <p style="font-weight:bold">التسجيل لورش العمل 👇🏼</p>
    <div style="margin:32px 0;text-align:center">
      <a href="${SITE_URL}/#agenda" style="display:inline-block;background:#0d9488;color:#000;font-weight:bold;padding:14px 32px;border-radius:999px;text-decoration:none;font-size:15px">
        سجّل الآن في الورش
      </a>
    </div>
    <p>📍 <strong>الموقع:</strong> بهو جامعة الإمام محمد بن سعود الإسلامية، الرياض</p>
    <p>🗓️ <strong>الموعد:</strong> الثلاثاء ١٩ مايو (للنساء) · ١٢ ظهرًا حتى ٨ مساءً</p>
    <p style="color:#6b7280;font-size:13px">Rawafed Fintech 2026 · Imam Mohammad Ibn Saud Islamic University · Riyadh</p>
    <img src="https://rawafedfintech.com/workshops-poster.jpg" alt="ورش العمل" style="width:100%;max-width:560px;border-radius:12px;margin-top:24px;display:block" />
  </div>
`;

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB\n");

  const profiles = await Profile.find({}).lean();
  console.log(`Found ${profiles.length} profiles\n`);

  let sent = 0, failed = 0;
  for (const p of profiles) {
    try {
      await resend.emails.send({
        from: "Rawafed Fintech <noreply@rawafedfintech.com>",
        to: p.email,
        subject: "روافد فنتك 2026 — سجّل في ورش العمل الآن 👇🏼",
        html: buildHtml(p.firstName),
      });
      console.log(`✓ ${p.email}`);
      sent++;
    } catch (err) {
      console.error(`✗ ${p.email} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. Sent: ${sent}, Failed: ${failed}`);
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
