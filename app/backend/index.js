// backend/index.js
import { prompt } from "./prompts.mjs";
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// email support
import nodemailer from "nodemailer";

import { rateLimit } from "express-rate-limit";

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Rate limiting tuning
// tune these via env:
//   RATE_LIMIT_WINDOW_MS (default 15 min)
//   RATE_LIMIT_MAX        (default 100 req/window)
//   CONTACT_LIMIT_WINDOW_MS (default 10 min)
//   CONTACT_LIMIT_MAX       (default 10 req/window)
const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000),
  max: Number(process.env.RATE_LIMIT_MAX ?? 100),
  standardHeaders: true,
  legacyHeaders: false,
});

const contactLimiter = rateLimit({
  windowMs: Number(process.env.CONTACT_LIMIT_WINDOW_MS ?? 10 * 60 * 1000),
  max: Number(process.env.CONTACT_LIMIT_MAX ?? 10),
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

// ---------- Nodemailer transport ----------
// Set these in backend/.env (examples):
//   SMTP_HOST=smtp.gmail.com
//   SMTP_PORT=465
//   SMTP_USER=your.email@yourdomain.com
//   SMTP_PASS=your_app_password_or_smtp_password
//   CONTACT_TO=owner@yourdomain.com
//   CONTACT_FROM=no-reply@yourdomain.com   (optional; defaults to SMTP_USER)
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  CONTACT_TO,
  CONTACT_FROM,
} = process.env;

const transport = nodemailer.createTransport({
  host: SMTP_HOST || "smtp.gmail.com",
  port: Number(SMTP_PORT) || 465,
  secure: (SMTP_PORT ? Number(SMTP_PORT) === 465 : true),
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

app.get("/api/contact/health", async (_req, res) => {
  if (!transport) {
    return res.json({ ok: false, error: "Mail transport not initialized yet." });
  }
  try {
    await transport.verify();
    return res.json({ ok: true });
  } catch (err) {
    return res
      .status(500)
      .json({ ok: false, error: err?.message || "Mail transport not ready" });
  }
});

app.post("/api/prompt", async (req, res) => {
  const { text, tone } = req.body;
  try {
    const result = await prompt(text, tone);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    // validation
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Name is required." });
    }
    const emailOk = typeof email === "string" && /^\S+@\S+\.\S+$/.test(email);
    if (!emailOk) {
      return res.status(400).json({ error: "A valid email is required." });
    }
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required." });
    }

    const to = CONTACT_TO || SMTP_USER;
    const from = CONTACT_FROM || SMTP_USER;
    if (!SMTP_USER || !SMTP_PASS) {
      return res
        .status(500)
        .json({ error: "Email transport is not configured on the server." });
    }

    const subject = `PromptMail Contact: ${name} <${email}>`;
    const textBody = `New Contact Message

From: ${name} <${email}>

Message:
${message}
`;
    const htmlBody = `
      <div style="font-family:system-ui,Arial,sans-serif;line-height:1.4">
        <h2>New Contact Message</h2>
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <p><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap">${message}</pre>
      </div>
    `;

    await transport.sendMail({
      to,
      from,
      replyTo: `${name} <${email}>`,
      subject,
      text: textBody,
      html: htmlBody,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("Contact form send failed:", err);
    res
      .status(500)
      .json({ error: "Failed to send your message. Please try again later." });
  }
});

app.use(express.static(path.join(__dirname, '../public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});