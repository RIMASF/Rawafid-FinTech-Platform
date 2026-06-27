const cron = require("node-cron");
const { Resend } = require("resend");
const Profile = require("./models/Profile");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendBulk(filter, subject, buildHtml) {
  const profiles = await Profile.find(filter).lean();
  console.log(`[Scheduler] Sending to ${profiles.length} profiles (${JSON.stringify(filter)})`);
  let sent = 0, failed = 0;
  for (const p of profiles) {
    try {
      await resend.emails.send({
        from: "Rawafed Fintech <noreply@rawafedfintech.com>",
        to: p.email,
        subject,
        html: buildHtml(p.firstName),
      });
      sent++;
    } catch (err) {
      console.error(`[Scheduler] Failed for ${p.email}:`, err.message);
      failed++;
    }
  }
  console.log(`[Scheduler] Done. Sent: ${sent}, Failed: ${failed}`);
}

const LOCATION_AR = `بهو جامعة الإمام محمد بن سعود الإسلامية، الرياض`;
const LOCATION_EN = `Hall of Imam Mohammad Ibn Saud Islamic University, Riyadh`;
const MAPS_URL = `https://maps.app.goo.gl/X2Tz4Ly6zuecmL1x6?g_st=ic`;

const tomorrowMale = (firstName) => `
  <div style="font-family:sans-serif;max-width:560px;margin:auto;direction:rtl;text-align:right">
    <h2 style="color:#0d9488">مرحبًا ${firstName}،</h2>
    <p>نذكّرك بأن فعالية <strong>روافد فنتك 2026</strong> ستُقام <strong>غدًا الاثنين 18 مايو 2026</strong> من الساعة <strong>12 ظهرًا حتى 8 مساءً</strong>.</p>
    <p>📍 <strong>الموقع:</strong> ${LOCATION_AR}<br/><a href="${MAPS_URL}" style="color:#0d9488">عرض على خرائط Google</a></p>
    <p>نتطلع إلى لقائك!</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
    <p style="direction:ltr;text-align:left">Hi ${firstName}, just a reminder that <strong>Rawafed Fintech 2026</strong> is <strong>tomorrow, Monday May 18, 2026</strong> from <strong>12:00 PM to 8:00 PM</strong>.</p>
    <p style="direction:ltr;text-align:left">📍 <strong>Location:</strong> ${LOCATION_EN}<br/><a href="${MAPS_URL}" style="color:#0d9488">View on Google Maps</a></p>
    <p style="color:#6b7280;font-size:13px;direction:ltr;text-align:left">Rawafed Fintech 2026 · Imam Mohammad Ibn Saud Islamic University · Riyadh</p>
  </div>
`;

const todayMale = (firstName) => `
  <div style="font-family:sans-serif;max-width:560px;margin:auto;direction:rtl;text-align:right">
    <h2 style="color:#0d9488">مرحبًا ${firstName}،</h2>
    <p>فعالية <strong>روافد فنتك 2026</strong> تبدأ <strong>اليوم الاثنين 18 مايو 2026</strong> من الساعة <strong>12 ظهرًا حتى 8 مساءً</strong>. لا تفوّت الحدث!</p>
    <p>📍 <strong>الموقع:</strong> ${LOCATION_AR}<br/><a href="${MAPS_URL}" style="color:#0d9488">عرض على خرائط Google</a></p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
    <p style="direction:ltr;text-align:left">Hi ${firstName}, <strong>Rawafed Fintech 2026</strong> is <strong>today, Monday May 18, 2026</strong> from <strong>12:00 PM to 8:00 PM</strong>. Don't miss it!</p>
    <p style="direction:ltr;text-align:left">📍 <strong>Location:</strong> ${LOCATION_EN}<br/><a href="${MAPS_URL}" style="color:#0d9488">View on Google Maps</a></p>
    <p style="color:#6b7280;font-size:13px;direction:ltr;text-align:left">Rawafed Fintech 2026 · Imam Mohammad Ibn Saud Islamic University · Riyadh</p>
  </div>
`;

const tomorrowFemale = (firstName) => `
  <div style="font-family:sans-serif;max-width:560px;margin:auto;direction:rtl;text-align:right">
    <h2 style="color:#0d9488">مرحبًا ${firstName}،</h2>
    <p>نذكّرك بأن فعالية <strong>روافد فنتك 2026</strong> ستُقام <strong>غدًا الثلاثاء 19 مايو 2026</strong> من الساعة <strong>12 ظهرًا حتى 8 مساءً</strong>.</p>
    <p>📍 <strong>الموقع:</strong> ${LOCATION_AR}<br/><a href="${MAPS_URL}" style="color:#0d9488">عرض على خرائط Google</a></p>
    <p>نتطلع إلى لقائك!</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
    <p style="direction:ltr;text-align:left">Hi ${firstName}, just a reminder that <strong>Rawafed Fintech 2026</strong> is <strong>tomorrow, Tuesday May 19, 2026</strong> from <strong>12:00 PM to 8:00 PM</strong>.</p>
    <p style="direction:ltr;text-align:left">📍 <strong>Location:</strong> ${LOCATION_EN}<br/><a href="${MAPS_URL}" style="color:#0d9488">View on Google Maps</a></p>
    <p style="color:#6b7280;font-size:13px;direction:ltr;text-align:left">Rawafed Fintech 2026 · Imam Mohammad Ibn Saud Islamic University · Riyadh</p>
  </div>
`;

const todayFemale = (firstName) => `
  <div style="font-family:sans-serif;max-width:560px;margin:auto;direction:rtl;text-align:right">
    <h2 style="color:#0d9488">مرحبًا ${firstName}،</h2>
    <p>فعالية <strong>روافد فنتك 2026</strong> تبدأ <strong>اليوم الثلاثاء 19 مايو 2026</strong> من الساعة <strong>12 ظهرًا حتى 8 مساءً</strong>. لا تفوّت الحدث!</p>
    <p>📍 <strong>الموقع:</strong> ${LOCATION_AR}<br/><a href="${MAPS_URL}" style="color:#0d9488">عرض على خرائط Google</a></p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
    <p style="direction:ltr;text-align:left">Hi ${firstName}, <strong>Rawafed Fintech 2026</strong> is <strong>today, Tuesday May 19, 2026</strong> from <strong>12:00 PM to 8:00 PM</strong>. Don't miss it!</p>
    <p style="direction:ltr;text-align:left">📍 <strong>Location:</strong> ${LOCATION_EN}<br/><a href="${MAPS_URL}" style="color:#0d9488">View on Google Maps</a></p>
    <p style="color:#6b7280;font-size:13px;direction:ltr;text-align:left">Rawafed Fintech 2026 · Imam Mohammad Ibn Saud Islamic University · Riyadh</p>
  </div>
`;

function startScheduler() {
  // Riyadh is UTC+3, so 8:00 AM Riyadh = 5:00 AM UTC => cron "0 5 * * *"

  const maleFilter   = { gender: { $in: ["male", "Male", "Male ", "ذكر"] } };
  const femaleFilter = { gender: { $in: ["female", "Female", "أنثى", "انثى"] } };

  // May 17 at 8:00 AM Riyadh — "tomorrow (Monday 18)" to males
  cron.schedule("0 5 17 5 *", () => {
    console.log("[Scheduler] May 17 — sending tomorrow reminder to males");
    sendBulk(maleFilter, "روافد فنتك — الحدث غدًا! | Rawafed Fintech — Event is Tomorrow!", tomorrowMale);
  }, { timezone: "Asia/Riyadh" });

  // May 18 at 8:00 AM Riyadh — "today (Monday 18)" to males + "tomorrow (Tuesday 19)" to females
  cron.schedule("0 5 18 5 *", () => {
    console.log("[Scheduler] May 18 — sending today to males, tomorrow to females");
    sendBulk(maleFilter,   "روافد فنتك — الحدث اليوم! | Rawafed Fintech — Event is Today!",     todayMale);
    sendBulk(femaleFilter, "روافد فنتك — الحدث غدًا! | Rawafed Fintech — Event is Tomorrow!", tomorrowFemale);
  }, { timezone: "Asia/Riyadh" });

  // May 19 at 8:00 AM Riyadh — "today (Tuesday 19)" to females
  cron.schedule("0 5 19 5 *", () => {
    console.log("[Scheduler] May 19 — sending today reminder to females");
    sendBulk(femaleFilter, "روافد فنتك — الحدث اليوم! | Rawafed Fintech — Event is Today!", todayFemale);
  }, { timezone: "Asia/Riyadh" });

  console.log("[Scheduler] Event notification crons registered (Asia/Riyadh timezone)");
}

module.exports = { startScheduler };
