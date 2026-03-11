const allowOrigin = (req) => {
  const configured = String(process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const origin = req.headers.origin;
  if (!origin) return '*';
  if (configured.length === 0) return origin;
  return configured.includes(origin) ? origin : 'null';
};

const json = (res, statusCode, body, origin) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.end(JSON.stringify(body));
};

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());

export default async function handler(req, res) {
  const origin = allowOrigin(req);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    return res.end();
  }

  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' }, origin);

  try {
    const { name, email, subject, message, _gotcha } = req.body || {};

    if (_gotcha) return json(res, 200, { ok: true }, origin);

    const safeName = String(name || '').trim();
    const safeEmail = String(email || '').trim();
    const safeSubject = String(subject || '').trim();
    const safeMessage = String(message || '').trim();

    if (!safeName) return json(res, 400, { ok: false, error: 'NAME_REQUIRED' }, origin);
    if (!isEmail(safeEmail)) return json(res, 400, { ok: false, error: 'EMAIL_INVALID' }, origin);
    if (!safeSubject) return json(res, 400, { ok: false, error: 'SUBJECT_REQUIRED' }, origin);
    if (!safeMessage) return json(res, 400, { ok: false, error: 'MESSAGE_REQUIRED' }, origin);
    if (safeMessage.length > 2000) return json(res, 400, { ok: false, error: 'MESSAGE_TOO_LONG' }, origin);

    const apiKey = String(process.env.RESEND_API_KEY || '').trim();
    const from = String(process.env.CONTACT_FROM || '').trim();
    const to = String(process.env.CONTACT_TO || '').trim();

    if (!apiKey || !from || !to) {
      return json(res, 500, { ok: false, error: 'SERVER_NOT_CONFIGURED' }, origin);
    }

    const text = [`姓名：${safeName}`, `邮箱：${safeEmail}`, `主题：${safeSubject}`, '', safeMessage].join('\n');

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `【网站联系】${safeSubject}`,
        text,
        reply_to: safeEmail
      })
    });

    if (!r.ok) {
      return json(res, 502, { ok: false, error: 'EMAIL_PROVIDER_ERROR' }, origin);
    }

    return json(res, 200, { ok: true }, origin);
  } catch (e) {
    return json(res, 500, { ok: false, error: 'SERVER_ERROR' }, origin);
  }
}
