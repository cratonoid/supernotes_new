const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// NOTE: credentials are embedded per user request. For production, move to environment variables.
const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: "support@supernotes.info",
    pass: "Sunil@321",
  },
  tls: {
    ciphers: "SSLv3",
  },
});

app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !message)
    return res.status(400).json({ error: "name and message required" });

  const mailOptions = {
    from: '"Supernotes Contact" <support@supernotes.info>',
    to: "alvisabreo.00@gmail.com",
    subject: "Contact form submission — Supernotes",
    text: `Name: ${name}\nEmail: ${email || "N/A"}\n\n${message}`,
    html: `<p><strong>Name:</strong> ${escapeHtml(
      name
    )}</p><p><strong>Email:</strong> ${escapeHtml(
      email || "N/A"
    )}</p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ ok: true });
  } catch (err) {
    console.error("sendMail error", err);
    res
      .status(500)
      .json({ error: err && err.message ? err.message : "send failed" });
  }
});

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Email server listening on ${PORT}`));
