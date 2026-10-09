'use client';

import Link from 'next/link';
import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { ALLOWED_FILE, EMAIL_RE, MAX_FILES, MAX_TOTAL_BYTES } from '@/lib/contact-rules';
import { COMPANY, type Lang } from '@/lib/i18n';
import type { Dict } from '@/lib/dictionaries/de';

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'ok' } | { kind: 'error'; message: string };

const SERVER_ERRORS: Record<string, keyof Dict['contact']['form']['errors']> = {
  invalid: 'required',
  email: 'email',
  consent: 'consent',
  files: 'files',
  type: 'type',
  rate: 'rate',
};

export function ContactForm({ lang, d }: { lang: Lang; d: Dict['contact']['form'] }) {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const fileInput = useRef<HTMLInputElement>(null);

  function fail(key: keyof typeof d.errors) {
    setStatus({ kind: 'error', message: d.errors[key] });
  }

  function onFiles(e: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (!picked.length) return;
    if (picked.some((f) => !ALLOWED_FILE.test(f.name))) return fail('type');
    const next = [...files, ...picked];
    const total = next.reduce((sum, f) => sum + f.size, 0);
    if (next.length > MAX_FILES || total > MAX_TOTAL_BYTES) return fail('files');
    setStatus({ kind: 'idle' });
    setFiles(next);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    if (!name || !email) return fail('required');
    if (!EMAIL_RE.test(email)) return fail('email');
    if (!data.get('consent')) return fail('consent');

    data.delete('files');
    files.forEach((f) => data.append('files', f));
    data.set('lang', lang);

    setStatus({ kind: 'sending' });
    try {
      const res = await fetch('/api/contact', { method: 'POST', body: data });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && json.ok) {
        form.reset();
        setFiles([]);
        setStatus({ kind: 'ok' });
      } else {
        fail(SERVER_ERRORS[json.error ?? ''] ?? 'generic');
      }
    } catch {
      fail('generic');
    }
  }

  const sending = status.kind === 'sending';

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div>
        <label htmlFor="f-name">{d.name}</label>
        <input id="f-name" name="name" autoComplete="name" required maxLength={120} />
      </div>
      <div>
        <label htmlFor="f-company">{d.company}</label>
        <input id="f-company" name="company" autoComplete="organization" maxLength={160} />
      </div>
      <div>
        <label htmlFor="f-email">{d.email}</label>
        <input id="f-email" name="email" type="email" autoComplete="email" required maxLength={160} />
      </div>
      <div>
        <label htmlFor="f-phone">{d.phone}</label>
        <input id="f-phone" name="phone" type="tel" autoComplete="tel" maxLength={60} />
      </div>
      <div>
        <label htmlFor="f-material">{d.material}</label>
        <select id="f-material" name="material">
          {d.materialOptions.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="f-qty">{d.qty}</label>
        <input id="f-qty" name="qty" inputMode="numeric" maxLength={40} />
      </div>
      <div className="full">
        <label htmlFor="f-message">{d.message}</label>
        <textarea id="f-message" name="message" placeholder={d.messagePlaceholder} maxLength={5000} />
      </div>

      <div className="full form-files">
        <label htmlFor="f-files">{d.files}</label>
        <input
          id="f-files"
          ref={fileInput}
          type="file"
          multiple
          accept=".dxf,.dwg,.step,.stp,.igs,.iges,.pdf,.png,.jpg,.jpeg,.zip"
          onChange={onFiles}
        />
        <small>{d.filesHint}</small>
        {files.length > 0 && (
          <ul>
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`}>
                <span>
                  {f.name} ({Math.max(1, Math.round(f.size / 1024))} KB)
                </span>
                <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))}>
                  {d.remove}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* honeypot: real visitors never see or fill this */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="full">
        <label className="consent" htmlFor="f-consent">
          <input id="f-consent" name="consent" type="checkbox" />
          <span>
            {d.consentBefore}
            <Link href={`/${lang}/datenschutz`} target="_blank">
              {d.consentLink}
            </Link>
            {d.consentAfter}
          </span>
        </label>
      </div>

      <div className="full">
        <button className="btn btn-primary" type="submit" disabled={sending}>
          {sending ? d.sending : d.submit}
        </button>
      </div>

      <div className="full" aria-live="polite">
        {status.kind === 'ok' && <p className="status ok">{d.success}</p>}
        {status.kind === 'error' && (
          <p className="status err">
            {status.message} {d.fallback} <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
          </p>
        )}
      </div>
    </form>
  );
}
