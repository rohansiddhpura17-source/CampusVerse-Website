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

async function runIdorSecurityTests() {
  console.log('--- 3. IDOR / Object-Level Authorization Tests ---');
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

  // User A (Student) and User B (Alumni)
  const student = await login('student@campusverse.edu', 'Password123');
  const alumni = await login('alumni@campusverse.edu', 'Password123');

  // 1. Student attempts to update Alumni's user profile
  const r1 = await request(`${BASE}/users/${alumni.user.id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${student.token}` },
    body: { fullName: 'Malicious Overwrite Attempt' }
  });
  check('Cross-user profile update rejected (403 FORBIDDEN)', r1.status === 403);

  // 2. Create private mock interview for Alumni
  const interviewRes = await request(`${BASE}/career/interviews`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${alumni.token}` },
    body: {
      interviewType: 'TECHNICAL',
      role: 'Staff Architect',
      question: 'Design high throughput stream processing pipeline',
      userResponse: 'Partition by consistent hashing across Kafka brokers'
    }
  });
  const interviewId = interviewRes.body.data?.id;

  if (interviewId) {
    // Student attempts to inspect Alumni's private mock interview
    const r2 = await request(`${BASE}/career/interviews/${interviewId}`, {
      headers: { Authorization: `Bearer ${student.token}` }
    });
    check('Cross-user mock interview access rejected (403 FORBIDDEN)', r2.status === 403);
  }

  // 3. Create private roadmap for Alumni
  const roadmapRes = await request(`${BASE}/career/roadmaps`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${alumni.token}` },
    body: {
      targetRole: 'VP of Engineering',
      duration: '18_MONTHS'
    }
  });
  const roadmapId = roadmapRes.body.data?.id;

  if (roadmapId) {
    // Student attempts to modify Alumni's private career roadmap
    const r3 = await request(`${BASE}/career/roadmaps/${roadmapId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${student.token}` },
      body: { targetRole: 'Demoted Role' }
    });
    check('Cross-user roadmap modification rejected (403 FORBIDDEN)', r3.status === 403);
  }

  // 4. Create private skill for Alumni
  const skillRes = await request(`${BASE}/career/skills`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${alumni.token}` },
    body: {
      name: `PrivateSkill-${Date.now()}`,
      category: 'LEADERSHIP',
      proficiency: 'EXPERT'
    }
  });
  const skillId = skillRes.body.data?.id;

  if (skillId) {
    // Student attempts to delete Alumni's skill
    const r4 = await request(`${BASE}/career/skills/${skillId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${student.token}` }
    });
    check('Cross-user skill deletion rejected (403 FORBIDDEN)', r4.status === 403);
  }

  await prisma.$disconnect();
  console.log(`IDOR Security Score: ${passed}/${total}\n`);
  return { passed, total, ok: passed === total };
}

if (require.main === module) {
  runIdorSecurityTests().then((res) => {
    if (!res.ok) process.exit(1);
  });
}

module.exports = { runIdorSecurityTests };
