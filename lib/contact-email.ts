import { siteConfig } from '@/lib/site';

import type { ContactFields } from './contact-schema';

/**
 * ------------------------------------------------------------------------------------
 * Contact email rendering.
 * ------------------------------------------------------------------------------------
 * SERVER-ONLY. Every visitor-controlled value is HTML-escaped before interpolation, so a
 * payload such as `<img onerror=...>` renders as inert text in the recipient's mail client.
 * ------------------------------------------------------------------------------------
 */

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  // Backtick is not required by HTML5 parsers, but some legacy mail clients treat it
  // as a quote character. Escaping it is free insurance.
  '`': '&#x60;',
};

/** Escape a value for safe interpolation into HTML text or a quoted attribute. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"'/`]/g, (char) => HTML_ESCAPES[char] ?? char);
}

/** `https://…` only — used for the visitor's email link. Invalid input yields an empty href. */
function safeMailto(email: string): string {
  const trimmed = email.trim();
  // Defensive: the Zod email validator already ran, but never build a link from raw input.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed) ? `mailto:${encodeURIComponent(trimmed)}` : '';
}

/** Collapse a free-text value to a single line for headers/plain text. */
function toSingleLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

export const CONTACT_EMAIL_SUBJECT = `New Contact Message — ${siteConfig.name}`;

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

function formatTimestamp(date: Date): string {
  // Fixed locale + UTC so the server output is deterministic regardless of host TZ.
  return `${date.toISOString().replace('T', ' ').slice(0, 19)} UTC`;
}

/** Subject line shown in the recipient's inbox. Never contains raw visitor input. */
export function buildSubject(need: string): string {
  const topic = toSingleLine(need).slice(0, 80);
  return topic ? `${CONTACT_EMAIL_SUBJECT} — ${topic}` : CONTACT_EMAIL_SUBJECT;
}

function renderDetailRow(label: string, valueHtml: string): string {
  return `
            <tr>
              <td style="padding:10px 16px;border-bottom:1px solid #e6ecf3;white-space:nowrap;vertical-align:top;font:600 13px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#5b6b7f;text-transform:uppercase;letter-spacing:.06em;width:132px;">${escapeHtml(label)}</td>
              <td style="padding:10px 16px;border-bottom:1px solid #e6ecf3;font:400 15px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#16222f;">${valueHtml}</td>
            </tr>`;
}

export function renderContactEmail(fields: ContactFields, receivedAt: Date = new Date()): RenderedEmail {
  const { name, email, company, need, message } = fields;
  const timestamp = formatTimestamp(receivedAt);

  // Escape once, reuse everywhere.
  const safeName = escapeHtml(toSingleLine(name));
  const safeEmail = escapeHtml(email);
  const mailto = safeMailto(email);
  const safeNeed = escapeHtml(toSingleLine(need));
  const safeTimestamp = escapeHtml(timestamp);

  const emailCell = mailto
    ? `<a href="${escapeHtml(mailto)}" style="color:#2563eb;text-decoration:underline;">${safeEmail}</a>`
    : safeEmail;

  const rows = [
    renderDetailRow('Name', safeName),
    renderDetailRow('Email', emailCell),
    renderDetailRow('Company', company ? escapeHtml(toSingleLine(company)) : '<span style="color:#93a3b5;">—</span>'),
    renderDetailRow('Subject', safeNeed),
    renderDetailRow('Received', safeTimestamp),
  ].join('');

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(CONTACT_EMAIL_SUBJECT)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f7fa;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fa;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border:1px solid #e6ecf3;border-radius:16px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
            <tr>
              <td style="background:linear-gradient(135deg,#58ecff,#5377ff 55%,#9c64ff);padding:26px 28px;">
                <p style="margin:0;font:600 12px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0b2b3a;letter-spacing:.12em;text-transform:uppercase;">Website enquiry</p>
                <h1 style="margin:8px 0 0;font:700 22px/1.3 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#08121f;">${escapeHtml(CONTACT_EMAIL_SUBJECT)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 20px 4px 20px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e6ecf3;border-radius:12px;border-collapse:separate;border-spacing:0;overflow:hidden;">${rows}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 20px 8px 20px;">
                <p style="margin:0 0 8px;font:600 13px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#5b6b7f;text-transform:uppercase;letter-spacing:.06em;">Message</p>
                <div style="padding:16px;background:#f7fafc;border:1px solid #e6ecf3;border-radius:12px;font:400 15px/1.65 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#16222f;white-space:pre-wrap;word-break:break-word;">${escapeHtml(message)}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 20px 24px 20px;">
                <p style="margin:0;font:400 13px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#7a8a9c;">
                  Reply directly to this email to answer ${escapeHtml(toSingleLine(name))}.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const divider = '-'.repeat(52);
  const text = [
    CONTACT_EMAIL_SUBJECT,
    divider,
    '',
    `Name:     ${toSingleLine(name)}`,
    `Email:   ${toSingleLine(email)}`,
    `Company: ${company ? toSingleLine(company) : '—'}`,
    `Subject: ${toSingleLine(need)}`,
    `Received: ${timestamp}`,
    '',
    'Message:',
    divider,
    message,
    divider,
    '',
    `Reply directly to this email to answer ${toSingleLine(name)}.`,
  ].join('\n');

  return { subject: buildSubject(need), html, text };
}