import {
  contactRequestSchema,
  isHoneypotTripped,
  parseContactRequest,
  PayloadTooLargeError,
  MAX_BODY_BYTES,
} from '../lib/contact-schema';
import { renderContactEmail, buildSubject, escapeHtml } from '../lib/contact-email';

let pass = 0;
let fail = 0;

function check(label: string, condition: boolean, detail = ''): void {
  if (condition) {
    pass += 1;
    console.log(`  [PASS] ${label}`);
  } else {
    fail += 1;
    console.log(`  [FAIL] ${label} ${detail}`);
  }
}

async function main() {
  const valid = {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    company: 'Analytical Engines Ltd',
    need: 'MVP Development',
    message: 'We need a multi-tenant SaaS platform with billing and an admin dashboard.',
    website: '',
  };

  console.log('\n=== 1. HONEYPOT SEMANTICS ===');
  const filled = contactRequestSchema.safeParse({ ...valid, website: 'http://spam.example' });
  check('filled honeypot PARSES ok (so route can fake-success it)', filled.success);
  check('isHoneypotTripped() detects it', filled.success && isHoneypotTripped(filled.data));
  const empty = contactRequestSchema.safeParse(valid);
  check('empty honeypot parses', empty.success);
  check('isHoneypotTripped() false for empty', empty.success && !isHoneypotTripped(empty.data));
  const missing = contactRequestSchema.safeParse({ ...valid, website: undefined });
  check('honeypot may be omitted entirely', missing.success && !isHoneypotTripped(missing.data));

  console.log('\n=== 2. STRICT MODE / UNKNOWN KEYS ===');
  check(
    'unknown key rejected',
    !contactRequestSchema.safeParse({ ...valid, isAdmin: true }).success,
  );
  check(
    'second unknown key rejected',
    !contactRequestSchema.safeParse({ ...valid, role: 'owner' }).success,
  );

  console.log('\n=== 3. VALIDATION RULES ===');
  const cases = [
    ['name required', { ...valid, name: '' }],
    ['name min 2', { ...valid, name: 'A' }],
    ['name max 120', { ...valid, name: 'n'.repeat(121) }],
    ['email required', { ...valid, email: '' }],
    ['email format', { ...valid, email: 'nope' }],
    ['need required', { ...valid, need: '' }],
    ['message required', { ...valid, message: '' }],
    ['message min 20', { ...valid, message: 'x'.repeat(19) }],
    ['message max 5000', { ...valid, message: 'x'.repeat(5001) }],
    ['company max 160', { ...valid, company: 'c'.repeat(161) }],
  ];
  for (const [label, payload] of cases as [string, Record<string, unknown>][]) {
    check(`rejects: ${label}`, !contactRequestSchema.safeParse(payload).success);
  }
  check('accepts boundary message = 20', contactRequestSchema.safeParse({ ...valid, message: 'x'.repeat(20) }).success);
  check('accepts boundary message = 5000', contactRequestSchema.safeParse({ ...valid, message: 'x'.repeat(5000) }).success);

  console.log('\n=== 4. WHITESPACE TRIMMING ===');
  const spaced = contactRequestSchema.parse({
    ...valid,
    name: '   Ada Lovelace   ',
    company: '  Engines  ',
    message: '   padded message that is long enough   ',
  });
  check('name trimmed', spaced.name === 'Ada Lovelace', `got "${spaced.name}"`);
  check('company trimmed', spaced.company === 'Engines', `got "${spaced.company}"`);
  check('message trimmed', !spaced.message.startsWith(' ') && !spaced.message.endsWith(' '));

  console.log('\n=== 5. BODY SIZE + JSON GUARDS ===');
  let threw = null;
  try {
    await parseContactRequest('x'.repeat(MAX_BODY_BYTES + 1));
  } catch (e) {
    threw = e;
  }
  check('oversized body throws PayloadTooLargeError', threw instanceof PayloadTooLargeError);

  threw = null;
  try {
    await parseContactRequest('{bad json');
  } catch (e) {
    threw = e;
  }
  check('malformed JSON throws SyntaxError', threw instanceof SyntaxError);

  console.log('\n=== 6. HTML ESCAPING (XSS) ===');
  check('escapes < >', escapeHtml('<b>') === '&lt;b&gt;');
  check('escapes double quote', escapeHtml('"') === '&quot;');
  check('escapes single quote', escapeHtml("'") === '&#39;');
  check('escapes forward slash', escapeHtml('/') === '&#x2F;');
  check('escapes backtick', escapeHtml('`') === '&#x60;');
  check('escapes ampersand first', escapeHtml('a & <b>') === 'a &amp; &lt;b&gt;');

  const xss = {
    ...valid,
    name: '<script>alert("x")</script>',
    company: '"><img src=x onerror=alert(1)>',
    message: '<script>fetch("//evil.example")</script> hello there, this is a long enough message.',
  };
  const rendered = renderContactEmail(xss, new Date('2026-10-04T12:30:00Z'));

  check('html has NO raw <script>', !/<script/i.test(rendered.html));
  check(
    'html has no RAW onerror inside a tag (injection fully escaped)',
    !/<[^>]*onerror\s*=/i.test(rendered.html),
  );
  check(
    'injected markup present only in escaped form',
    rendered.html.includes('&quot;&gt;&lt;img src=x onerror=alert(1)&gt;'),
  );
  check('html has NO raw <img', !/<img/i.test(rendered.html));
  check('escaped script tag present', rendered.html.includes('&lt;script&gt;'));
  check('subject is escaped/safe', !rendered.subject.includes('<'), `subject="${rendered.subject}"`);

  console.log('\n=== 7. EMAIL CONTENT ===');
  check('subject contains brand + topic', rendered.subject.includes('MVP Development'));
  check('subject built by buildSubject()', rendered.subject === buildSubject('MVP Development'));
  check('html contains visitor name (escaped)', rendered.html.includes('&lt;script&gt;'));
  check('text version present and non-empty', rendered.text.length > 100);
  check('text contains Name line', /^Name:/m.test(rendered.text));
  check('text contains Email line', /^Email:/m.test(rendered.text));
  check('text contains Subject line', /^Subject:/m.test(rendered.text));
  check('text contains timestamp (UTC)', rendered.text.includes('UTC'));
  check('html has mailto for visitor', /href="mailto:ada%40example\.com"/.test(rendered.html));

  console.log('\n=== 8. HEADER-INJECTION GUARD ===');
  const crlf = { ...valid, name: 'Eve\r\nBcc: attacker@evil.example' };
  const r2 = renderContactEmail(crlf);
  check('CRLF collapsed out of subject', !r2.subject.includes('\n') && !r2.subject.includes('\r'));
  check('CRLF collapsed out of text Name line', !/^Name:.*\r/m.test(r2.text));

  console.log('\n=== 9. EMPTY COMPANY FALLBACK ===');
  const r3 = renderContactEmail({ ...valid, company: '' });
  check('empty company renders a dash', r3.html.includes('—'));

  console.log(`\n${'='.repeat(50)}\nRESULT: ${pass} passed, ${fail} failed\n${'='.repeat(50)}`);
  process.exit(fail === 0 ? 0 : 1);
}

void main();
