import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import nodemailer from 'nodemailer';

const app = express();

const allowedOrigins = String(process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    }
  })
);

app.use(express.json({ limit: '50kb' }));

const createTransport = () => {
  const host = String(process.env.SMTP_HOST || '').trim();
  const port = Number(process.env.SMTP_PORT || 465);
  const user = String(process.env.SMTP_USER || '').trim();
  const pass = String(process.env.SMTP_PASS || '').trim();

  if (!host || !user || !pass || !Number.isFinite(port)) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
};

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());

const clientIp = (req) => {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.trim()) return xff.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
};

const rateLimitState = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 8;

const checkRateLimit = (key) => {
  const now = Date.now();
  const bucket = rateLimitState.get(key) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  bucket.count += 1;
  rateLimitState.set(key, bucket);
  return bucket.count <= RATE_LIMIT_MAX;
};

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/contact', async (req, res) => {
  try {
    const ip = clientIp(req);
    if (!checkRateLimit(ip)) return res.status(429).json({ ok: false, error: 'TOO_MANY_REQUESTS' });

    const { name, email, subject, message, _gotcha } = req.body || {};

    if (_gotcha) return res.json({ ok: true });

    const safeName = String(name || '').trim();
    const safeEmail = String(email || '').trim();
    const safeSubject = String(subject || '').trim();
    const safeMessage = String(message || '').trim();

    if (!safeName) return res.status(400).json({ ok: false, error: 'NAME_REQUIRED' });
    if (!isEmail(safeEmail)) return res.status(400).json({ ok: false, error: 'EMAIL_INVALID' });
    if (!safeSubject) return res.status(400).json({ ok: false, error: 'SUBJECT_REQUIRED' });
    if (!safeMessage) return res.status(400).json({ ok: false, error: 'MESSAGE_REQUIRED' });
    if (safeMessage.length > 2000) return res.status(400).json({ ok: false, error: 'MESSAGE_TOO_LONG' });

    const transporter = createTransport();
    const to = String(process.env.CONTACT_TO || '').trim();
    const from = String(process.env.CONTACT_FROM || process.env.SMTP_USER || '').trim();

    if (!transporter || !to || !from) {
      return res.status(500).json({ ok: false, error: 'SERVER_NOT_CONFIGURED' });
    }

    const text = [`姓名：${safeName}`, `邮箱：${safeEmail}`, `主题：${safeSubject}`, '', safeMessage].join('\n');

    await transporter.sendMail({
      from,
      to,
      subject: `【网站联系】${safeSubject}`,
      text,
      replyTo: safeEmail
    });

    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'SERVER_ERROR' });
  }
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  console.log(`[contact-server] listening on http://localhost:${port}`);
});
