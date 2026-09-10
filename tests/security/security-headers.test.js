const http = require('http');

const WEB_BASE = 'http://127.0.0.1:3000';

function getHeaders(url) {
  const parsed = new URL(url);
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname,
        method: 'GET'
      },
      (res) => {
        resolve({ status: res.statusCode, headers: res.headers });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function runSecurityHeadersTests() {
  console.log('--- 7. Next.js Security Headers & CSP Tests ---');
  let passed = 0;
  let total = 0;

  function check(name, condition) {
    total++;
    if (condition) {
      console.log(`  ✓ ${name}`);
      passed++;
    } else {
      console.error(`  ✗ ${name}`);
    }
  }

  const res = await getHeaders(`${WEB_BASE}/`);
  const headers = res.headers;

  check('X-Frame-Options is DENY', headers['x-frame-options'] === 'DENY');
  check('X-Content-Type-Options is nosniff', headers['x-content-type-options'] === 'nosniff');
  check('Referrer-Policy is strict-origin-when-cross-origin', headers['referrer-policy'] === 'strict-origin-when-cross-origin');
  check('Permissions-Policy is present and restricts sensors', headers['permissions-policy'] && headers['permissions-policy'].includes('camera=()'));
  check('Strict-Transport-Security is present', headers['strict-transport-security'] && headers['strict-transport-security'].includes('max-age=31536000'));
  check('Content-Security-Policy is present and enforces default-src', headers['content-security-policy'] && headers['content-security-policy'].includes("default-src 'self'"));

  console.log(`Security Headers Score: ${passed}/${total}\n`);
  return { passed, total, ok: passed === total };
}

if (require.main === module) {
  runSecurityHeadersTests().then((res) => {
    if (!res.ok) process.exit(1);
  });
}

module.exports = { runSecurityHeadersTests };
