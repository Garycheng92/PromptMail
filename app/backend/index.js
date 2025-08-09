import { prompt } from "./prompts.mjs";
import cors from "cors";
import express from "express";

// email support
import nodemailer from "nodemailer";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/*
  ---------- MAIL TRANSPORT (Ethereal for development) ----------
  I ended up having to revert from the Gmail/SMTP env-based transport to an
  Ethereal test account which gets created at server startup.

  Ethereal advantages:
    - No real email is sent
    - we will get a preview URL to view the email in a browser
    - No app passwords or 2 step authenication needed


*/
let transport = null;
let etherealAccount = null;

(async () => {
  try {
    etherealAccount = await nodemailer.createTestAccount();

    transport = nodemailer.createTransport({
      host: etherealAccount.smtp.host,
      port: etherealAccount.smtp.port,
      secure: etherealAccount.smtp.secure, // true for 465, false otherwise
      auth: {
        user: etherealAccount.user,
        pass: etherealAccount.pass,
      },
    });

    console.log("Ethereal SMTP ready ✅");
    console.log("Login:", etherealAccount.user);
    console.log("Pass: ", etherealAccount.pass);
  } catch (err) {
    console.error("Failed to initialize Ethereal transport:", err);
  }
})();


//Health-check for mailer

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

// API route
app.post("/api/prompt", async (req, res) => {
  const { text, tone } = req.body;
  try {
    const result = await prompt(text, tone);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Contact Us Route using the ethereal transport
app.post("/api/contact", async (req, res) => {
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

    if (!transport) {
      return res
        .status(500)
        .json({ error: "Email transport is not initialized on the server." });
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

    
    const info = await transport.sendMail({
      to: "contact@promptmail.ethereal",           
      from: `"PromptMail Contact" <no-reply@promptmail.dev>`,
      replyTo: `${name} <${email}>`,               // replies go back to the user
      subject,
      text: textBody,
      html: htmlBody,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("Ethereal Preview URL:", previewUrl);
    }

    // Keep response shape compatible (ok: true). Extra preview field is additive/non-breaking.
    res.json({ ok: true, preview: previewUrl || null });
  } catch (err) {
    console.error("Contact form send failed:", err);
    res.status(500).json({ error: "Failed to send your message. Please try again later." });
  }
});

// ------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
