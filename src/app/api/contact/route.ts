import { NextResponse } from 'next/server';
import nodemailer, { type Transporter } from 'nodemailer';
import { ALLOWED_FILE, EMAIL_RE, MAX_FILES, MAX_TOTAL_BYTES } from '@/lib/contact-rules';

export const runtime = 'nodejs';

// --- very small in-memory rate limit: 5 requests per IP per hour ---
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 3_600_000);
  if (recent.length >= 5) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

const fail = (status: number, error: string) => NextResponse.json({ ok: false, error }, { status });

const clean = (v: FormDataEntryValue | null, max: number) => String(v ?? '').replace(/\r/g, '').trim().slice(0, max);
const oneLine = (v: string) => v.replace(/[\r\n]+/g, ' ');
const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function POST(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim();
  if (rateLimited(ip)) return fail(429, 'rate');

  const length = Number(req.headers.get('content-length') ?? 0);
  if (length > MAX_TOTAL_BYTES + 512 * 1024) return fail(413, 'files');

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail(400, 'invalid');
  }

  // Bots fill the hidden field. Pretend everything worked.
  if (clean(form.get('website'), 200)) return NextResponse.json({ ok: true });

  const name = oneLine(clean(form.get('name'), 120));
  const email = oneLine(clean(form.get('email'), 160));
  const company = oneLine(clean(form.get('company'), 160));
  const phone = oneLine(clean(form.get('phone'), 60));
  const material = oneLine(clean(form.get('material'), 60));
  const qty = oneLine(clean(form.get('qty'), 40));
  const message = clean(form.get('message'), 5000);
  const lang = clean(form.get('lang'), 2) === 'en' ? 'EN' : 'DE';

  if (!name || !email) return fail(400, 'invalid');
  if (!EMAIL_RE.test(email)) return fail(400, 'email');
  if (!form.get('consent')) return fail(400, 'consent');

  const files = form.getAll('files').filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > MAX_FILES || files.reduce((s, f) => s + f.size, 0) > MAX_TOTAL_BYTES) return fail(400, 'files');
  if (files.some((f) => !ALLOWED_FILE.test(f.name))) return fail(400, 'type');

  const attachments = await Promise.all(
    files.map(async (f) => ({
      filename: f.name.replace(/[\\/:*?"<>|\r\n]+/g, '_').slice(0, 120),
      content: Buffer.from(await f.arrayBuffer()),
    })),
  );

  const rows: [string, string][] = [
    ['Name', name],
    ['Firma', company || '-'],
    ['E-Mail', email],
    ['Telefon', phone || '-'],
    ['Werkstoff', material || '-'],
    ['Stückzahl', qty || '-'],
    ['Sprache der Website', lang],
    ['Anhänge', attachments.length ? attachments.map((a) => a.filename).join(', ') : '-'],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\n${message || '(keine Nachricht)'}\n`;
  const html =
    `<table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif">` +
    rows.map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join('') +
    `</table><p style="font-family:sans-serif;white-space:pre-wrap">${esc(message || '(keine Nachricht)')}</p>`;

  const to = process.env.MAIL_TO || 'info@mth-halle.de';
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || 'website@mth-halle.de';

  let transporter: Transporter;
  if (process.env.MAIL_DRY_RUN) {
    transporter = nodemailer.createTransport({ jsonTransport: true });
  } else if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  } else {
    console.error('[contact] SMTP is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS (see .env.example).');
    return fail(503, 'not_configured');
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      replyTo: `"${name.replace(/"/g, '')}" <${email}>`,
      subject: `[Website] Anfrage von ${name}${company ? ` (${company})` : ''}`.slice(0, 200),
      text,
      html,
      attachments,
    });
    if (process.env.MAIL_DRY_RUN) console.log('[contact] dry run, mail not sent:', String(info.message).slice(0, 600));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] sending failed:', err);
    return fail(502, 'send_failed');
  }
}
