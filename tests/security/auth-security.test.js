const http = require('http');
const jwt = require('/Users/rohansiddhpura/AndroidStudioProjects/CampusVerse/backend/node_modules/jsonwebtoken');
const { PrismaClient } = require('/Users/rohansiddhpura/AndroidStudioProjects/CampusVerse/backend/node_modules/@prisma/client');

const prisma = new PrismaClient({
  datasources: { db: { url: 'file:/Users/rohansiddhpura/AndroidStudioProjects/CampusVerse/backend/prisma/dev.db' } }
});

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

async function runAuthSecurityTests() {
  console.log('--- 1. Authentication Security & Token Tampering Tests ---');
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

  // 1. Invalid credentials
  const r1 = await request(`${BASE}/auth/login`, {
    method: 'POST',
    body: { email: 'student@campusverse.edu', password: 'WrongPassword123!' }
  });
  check('Invalid password returns 401 UNAUTHORIZED', r1.status === 401);

  // 2. Missing authorization token on protected route
  const r2 = await request(`${BASE}/auth/me`);
  check('Missing Authorization header returns 401', r2.status === 401);

  // 3. Empty Bearer token
  const r3 = await request(`${BASE}/auth/me`, {
    headers: { Authorization: 'Bearer ' }
  });
  check('Empty Bearer token returns 401', r3.status === 401);

  // 4. Malformed/Garbage token
  const r4 = await request(`${BASE}/auth/me`, {
    headers: { Authorization: 'Bearer not.a.valid.jwt.token' }
  });
  check('Malformed token returns 401', r4.status === 401);

  // 5. Valid login to get legitimate token
  const loginRes = await request(`${BASE}/auth/login`, {
    method: 'POST',
    body: { email: 'student@campusverse.edu', password: 'Password123' }
  });
  const validToken = loginRes.body.data?.token || loginRes.body.data?.tokens?.accessToken;
  const decoded = jwt.decode(validToken);

  // 6. Token tampering: Modify payload to claim ADMIN role with forged signature
  const forgedToken = jwt.sign(
    { ...decoded, role: 'ADMIN', isAdminAuthorized: true },
    'wrong_secret_key_attacker_attempt'
  );
  const r6 = await request(`${BASE}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${forgedToken}` }
  });
  check('Forged JWT signature returns 401 INVALID_TOKEN', r6.status === 401);

  // 7. Expired token
  const expiredToken = jwt.sign(
    { ...decoded, exp: Math.floor(Date.now() / 1000) - 3600 },
    'campusverse_super_secure_jwt_secret_key_2026_dev'
  );
  const r7 = await request(`${BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${expiredToken}` }
  });
  check('Expired token returns 401', r7.status === 401);

  // 8. Inactive user token check
  // Temporarily mark a candidate user inactive
  const testUser = await prisma.user.findFirst({ where: { email: 'candidate_admin@campusverse.edu' } });
  if (testUser) {
    await prisma.user.update({ where: { id: testUser.id }, data: { isActive: false } });
    const candidateLogin = jwt.sign(
      { userId: testUser.id, email: testUser.email, role: testUser.role, isAdminAuthorized: false },
      'campusverse_super_secure_jwt_secret_key_2026_dev',
      { expiresIn: '1h' }
    );
    const r8 = await request(`${BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${candidateLogin}` }
    });
    check('Inactive user token returns 401 ACCOUNT_INACTIVE', r8.status === 401 && r8.body.error?.code === 'ACCOUNT_INACTIVE');
    // Restore user
    await prisma.user.update({ where: { id: testUser.id }, data: { isActive: true } });
  }

  await prisma.$disconnect();
  console.log(`Auth Security Score: ${passed}/${total}\n`);
  return { passed, total, ok: passed === total };
}

if (require.main === module) {
  runAuthSecurityTests().then((res) => {
    if (!res.ok) process.exit(1);
  });
}

module.exports = { runAuthSecurityTests };
