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
  if (!token) throw new Error(`Login failed for ${email}`);
  return token;
}

async function runRbacSecurityTests() {
  console.log('--- 2. RBAC & Cross-Role Authorization Tests ---');
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
  const aspirantToken = await login('aspirant@campusverse.edu', 'Password123');
  const alumniToken = await login('alumni@campusverse.edu', 'Password123');
  const unauthAdminToken = await login('unverified_admin@campusverse.edu', 'Password123');
  const authAdminToken = await login('admin@campusverse.edu', 'Password123');

  // Student to Admin APIs
  const r1 = await request(`${BASE}/admin/dashboard`, { headers: { Authorization: `Bearer ${studentToken}` } });
  check('Student blocked from /admin/dashboard (403)', r1.status === 403);

  const r2 = await request(`${BASE}/admin/users`, { headers: { Authorization: `Bearer ${studentToken}` } });
  check('Student blocked from /admin/users (403)', r2.status === 403);

  // Aspirant to Admin APIs
  const r3 = await request(`${BASE}/admin/reports`, { headers: { Authorization: `Bearer ${aspirantToken}` } });
  check('Aspirant blocked from /admin/reports (403)', r3.status === 403);

  // Alumni to Admin APIs
  const r4 = await request(`${BASE}/admin/settings`, { headers: { Authorization: `Bearer ${alumniToken}` } });
  check('Alumni blocked from /admin/settings (403)', r4.status === 403);

  // Unauthorized Admin to Admin APIs
  const r5 = await request(`${BASE}/admin/dashboard`, { headers: { Authorization: `Bearer ${unauthAdminToken}` } });
  check('Admin with isAdminAuthorized=false returns 403 ADMIN_UNAUTHORIZED', r5.status === 403 && r5.body.error?.code === 'ADMIN_UNAUTHORIZED');

  const r6 = await request(`${BASE}/admin/verifications`, { headers: { Authorization: `Bearer ${unauthAdminToken}` } });
  check('Unauthorized Admin blocked from /admin/verifications (403)', r6.status === 403);

  // Authorized Admin allowed
  const r7 = await request(`${BASE}/admin/dashboard`, { headers: { Authorization: `Bearer ${authAdminToken}` } });
  check('Authorized Admin granted access to /admin/dashboard (200)', r7.status === 200);

  console.log(`RBAC Security Score: ${passed}/${total}\n`);
  return { passed, total, ok: passed === total };
}

if (require.main === module) {
  runRbacSecurityTests().then((res) => {
    if (!res.ok) process.exit(1);
  });
}

module.exports = { runRbacSecurityTests };
