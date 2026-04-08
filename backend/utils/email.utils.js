import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// @returns {Promise} — email yuboradi
const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"CODERS" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html
  });
};

// @returns {string} — yangi dars email shabloni
const newVideoTemplate = (userName, videoTitle) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
    <h2 style="color:#1a1a2e">Yangi dars qo'shildi!</h2>
    <p>Salom, <strong>${userName}</strong>!</p>
    <p>Yangi dars mavjud: <strong>${videoTitle}</strong></p>
    <a href="${process.env.CLIENT_URL}/videos" style="background:#4f46e5;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">Darsga o'tish</a>
  </div>
`;

// @returns {string} — sertifikat email shabloni
const certificateTemplate = (userName, section) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
    <h2 style="color:#1a1a2e">Tabriklaymiz!</h2>
    <p>Salom, <strong>${userName}</strong>!</p>
    <p><strong>${section}</strong> bo'limini muvaffaqiyatli tugatdingiz va sertifikat oldingiz!</p>
    <a href="${process.env.CLIENT_URL}/certificates" style="background:#4f46e5;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">Sertifikatni ko'rish</a>
  </div>
`;

// @returns {string} — daraja ko'tarildi email shabloni
const levelUpTemplate = (userName, level) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
    <h2 style="color:#1a1a2e">Darajangiz ko'tarildi!</h2>
    <p>Salom, <strong>${userName}</strong>!</p>
    <p>Yangi darajangiz: <strong>${level}</strong></p>
    <a href="${process.env.CLIENT_URL}/dashboard" style="background:#4f46e5;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none">Dashboardga o'tish</a>
  </div>
`;

export { sendEmail, newVideoTemplate, certificateTemplate, levelUpTemplate };
