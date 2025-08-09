// backend/index.js
import { prompt } from "./prompts.mjs";
import cors from "cors";
import express from "express";

// email support
import nodemailer from "nodemailer";

// rate limiting
import { rateLimit } from "express-rate-limit";

const app = express();
const PORT = 5000;

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

// Stricter limiter for contact (email-sending) endpoints
const contactLimiter = rateLimit({
  windowMs: Number(process.env.CONTACT_LIMIT_WINDOW_MS ?? 10 * 60 * 1000),
  max: Number(process.env.CONTACT_LIMIT_MAX ?? 10),
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general limiter to all API routes
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

// defaults for Gmail
const transport = nodemailer.createTransport({
  host: SMTP_HOST || "smtp.gmail.com",
  port: Number(SMTP_PORT) || 465,
  secure: (SMTP_PORT ? Number(SMTP_PORT) === 465 : true), // true for 465, false for 587
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

//  Health-check for mailer covered by /api limiter 
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

//  API Prompt 
app.post("/api/prompt", async (req, res) => {
  const { text, tone } = req.body;
  try {
    const result = await prompt(text, tone);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Contact Us Route
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
      replyTo: `${name} <${email}>`, // enables replies to go back to the user
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
