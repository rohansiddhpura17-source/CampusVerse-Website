const http = require('http');
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

async function login(email, password) {
  const res = await request(`${BASE}/auth/login`, {
    method: 'POST',
    body: { email, password }
  });
  const token = res.body.data?.token || res.body.data?.tokens?.accessToken;
  const user = res.body.data?.user;
  user.id = user.id || user.userId;
  return { token, user };
}

async function runRoleEscalationTests() {
  console.log('--- 4. Role Escalation Tests ---');
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

  const student = await login('student@campusverse.edu', 'Password123');

  // 1. Attempt self-escalation via PATCH /users/:id with role: 'ADMIN'
  const r1 = await request(`${BASE}/users/${student.user.id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${student.token}` },
    body: {
      role: 'ADMIN',
      isAdminAuthorized: true
    }
  });

  // Verify database record still has role: 'STUDENT'
  const dbUser = await prisma.user.findUnique({ where: { id: student.user.id } });
  check('Self-escalation via profile update ignored by User model', dbUser.role === 'STUDENT' && dbUser.isAdminAuthorized === false);

  // 2. Student attempts calling admin user status endpoint
  const r2 = await request(`${BASE}/admin/users/${student.user.id}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${student.token}` },
    body: { role: 'ADMIN', isAdminAuthorized: true }
  });
  check('Student calling admin role mutation returns 403 FORBIDDEN', r2.status === 403);

  // 3. Student attempts self-verification approval
  const r3 = await request(`${BASE}/admin/verifications/any-id/review`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${student.token}` },
    body: { status: 'APPROVED' }
  });
  check('Student calling admin verification review returns 403 FORBIDDEN', r3.status === 403);

  await prisma.$disconnect();
  console.log(`Role Escalation Score: ${passed}/${total}\n`);
  return { passed, total, ok: passed === total };
}

if (require.main === module) {
  runRoleEscalationTests().then((res) => {
    if (!res.ok) process.exit(1);
  });
}

module.exports = { runRoleEscalationTests };
