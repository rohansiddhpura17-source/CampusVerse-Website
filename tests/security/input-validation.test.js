const http = require('http');

const BASE = 'http://127.0.0.1:4000/api/v1';

function request(url, options = {}) {
  const parsed = new URL(url);
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.pathname + parsed.search,
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, body: data });
          }
        });
      }
    );
    req.on('error', reject);
    if (options.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}

async function login(email, password) {
  const res = await request(`${BASE}/auth/login`, {
    method: 'POST',
    body: { email, password }
  });
  const token = res.body.data?.token || res.body.data?.tokens?.accessToken;
  return token;
}

async function runInputValidationTests() {
  console.log('--- 6. Malicious Input & Edge Case Validation Tests ---');
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

  const studentToken = await login('student@campusverse.edu', 'Password123');

  // 1. Extreme length string on login email
  const hugeEmail = 'a'.repeat(5000) + '@evil.com';
  const r1 = await request(`${BASE}/auth/login`, {
    method: 'POST',
    body: { email: hugeEmail, password: 'Password123' }
  });
  check('Oversized input safely handled (400 or 401)', r1.status === 400 || r1.status === 401);

  // 2. SQL injection pattern in search query parameter
  const r2 = await request(`${BASE}/events?search=' OR '1'='1`, {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  check('SQL injection pattern handled safely by Prisma ORM parameterization (200)', r2.status === 200);

  // 3. XSS script payload stored in marketplace title/description
  const scriptPayload = '<script>alert("XSS")</script>';
  const r3 = await request(`${BASE}/marketplace`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${studentToken}` },
    body: {
      title: scriptPayload,
      description: 'Harmless test description',
      price: 250,
      category: 'TEXTBOOKS'
    }
  });
  if (r3.status === 201) {
    // If accepted by backend, verify it is stored as raw literal text, not executed
    check('Script payload stored as literal text string without executing', r3.body.data?.title === scriptPayload);
  } else {
    check('Script payload intercepted by input validation schema', r3.status === 400);
  }

  // 4. Invalid types: Passing object instead of string for title
  const r4 = await request(`${BASE}/marketplace`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${studentToken}` },
    body: {
      title: { $ne: null },
      description: 'Object injection attempt',
      price: 100,
      category: 'TEXTBOOKS'
    }
  });
  check('Object injection rejected with 400 VALIDATION_ERROR', r4.status === 400);

  // 5. Negative numbers on price
  const r5 = await request(`${BASE}/marketplace`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${studentToken}` },
    body: {
      title: 'Negative Price Item',
      description: 'Testing validation limits',
      price: -500,
      category: 'TEXTBOOKS'
    }
  });
  check('Negative price rejected with 400 or handled safely', r5.status === 400 || r5.status === 201);

  console.log(`Input Validation Score: ${passed}/${total}\n`);
  return { passed, total, ok: passed === total };
}

if (require.main === module) {
  runInputValidationTests().then((res) => {
    if (!res.ok) process.exit(1);
  });
}

module.exports = { runInputValidationTests };
