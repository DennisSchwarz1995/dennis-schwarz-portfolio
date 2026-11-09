import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.set('trust proxy', 1);

app.use(helmet());
app.use(express.json({ limit: '32kb' }));

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 5, // Max. 5 contact requests per IP / 15 Min.
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'RATE_LIMIT_EXCEEDED' },
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function escapeHtml(unsafe = '') {
  return String(unsafe)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.get('/healthz', (_req, res) => {
  res.status(200).send('ok');
});

app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const { name, email, message, privacyAccepted, website } = req.body ?? {};

    // Honeypot against Spam-Bots: answering still with 200 if the hidden field is filled
    if (typeof website === 'string' && website.trim().length > 0) {
      return res.status(200).json({ ok: true });
    }

    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanEmail = typeof email === 'string' ? email.trim() : '';
    const cleanMessage = typeof message === 'string' ? message.trim() : '';

    if (
      cleanName.length < 2 ||
      cleanName.length > 120 ||
      !EMAIL_REGEX.test(cleanEmail) ||
      cleanEmail.length > 160 ||
      cleanMessage.length < 10 ||
      cleanMessage.length > 5000 ||
      privacyAccepted !== true
    ) {
      return res.status(400).json({ error: 'INVALID_PAYLOAD' });
    }

    const recipient = process.env.MAIL_TO || 'kontakt@dennis-schwarz.dev';
    const sender = process.env.MAIL_FROM || process.env.SMTP_USER || recipient;

    await transporter.sendMail({
      from: `"Portfolio Kontaktformular" <${sender}>`,
      to: recipient,
      replyTo: `"${cleanName.replaceAll('"', '')}" <${cleanEmail}>`,
      subject: `Neue Projektanfrage von ${cleanName} – dennis-schwarz.dev`,
      text: [
        `Neue Kontaktanfrage über dennis-schwarz.dev`,
        `--------------------------------------------`,
        `Name:    ${cleanName}`,
        `E-Mail:  ${cleanEmail}`,
        `DSGVO:   Zugestimmt`,
        ``,
        `Nachricht:`,
        cleanMessage,
      ].join('\n'),
      html: `
        <div style="background:#121212;color:#f5f5f5;padding:32px;font-family:system-ui,-apple-system,sans-serif;border:1px solid #2b2318;">
          <p style="margin:0 0 8px;color:#b08d57;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;">
            dennis-schwarz.dev · Kontaktformular
          </p>
          <h2 style="margin:0 0 24px;color:#f5f5f5;font-weight:600;">
            Neue Nachricht von ${escapeHtml(cleanName)}
          </h2>
          <div style="background:#1a1a1a;padding:20px;border-left:3px solid #c5832b;margin-bottom:24px;">
            <p style="margin:0 0 8px;color:#a0a0a0;font-size:14px;">
              <strong style="color:#f5f5f5;">Absender:</strong> ${escapeHtml(cleanName)} &lt;${escapeHtml(cleanEmail)}&gt;
            </p>
            <p style="margin:0;color:#a0a0a0;font-size:13px;">
              Datenschutzerklärung akzeptiert: Ja
            </p>
          </div>
          <div style="white-space:pre-wrap;line-height:1.65;color:#f5f5f5;font-size:15px;">${escapeHtml(cleanMessage)}</div>
        </div>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[portfolio-mailer] Mail dispatch failed:', err);
    return res.status(500).json({ error: 'MAIL_DISPATCH_FAILED' });
  }
});

app.listen(PORT, () => {
  console.log(`[portfolio-mailer] Listening on port ${PORT}`);
});
