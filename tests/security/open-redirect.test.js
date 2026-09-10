// Test suite for Open Redirect Protection logic

function getRoleDashboard(role) {
  switch (role) {
    case 'STUDENT':
      return '/student/dashboard';
    case 'ASPIRANT':
      return '/aspirant/dashboard';
    case 'ALUMNI':
      return '/alumni/dashboard';
    case 'ADMIN':
      return '/admin/dashboard';
    default:
      return '/';
  }
}

function getSafeRedirectUrl(redirectUrl, userRole, isAdminAuthorized) {
  if (!redirectUrl) return getRoleDashboard(userRole);

  const clean = redirectUrl.trim();

  // 1. Must be a strictly internal relative path starting with '/' and NOT '//' or '/\'
  if (!clean.startsWith('/') || clean.startsWith('//') || clean.startsWith('/\\') || clean.startsWith('\\')) {
    return getRoleDashboard(userRole);
  }

  // 2. Reject URLs with protocol schemes or colon anywhere in path
  const pathPart = clean.split('?')[0];
  if (pathPart.includes(':') || clean.toLowerCase().includes('javascript:') || clean.toLowerCase().includes('data:')) {
    return getRoleDashboard(userRole);
  }

  // 3. Reject URL-encoded slashes or backslashes (%2f, %5c)
  if (clean.includes('%2f') || clean.includes('%2F') || clean.includes('%5c') || clean.includes('%5C')) {
    return getRoleDashboard(userRole);
  }

  // 4. Reject internal auth paths to avoid redirect loops
  if (clean.startsWith('/auth/')) {
    return getRoleDashboard(userRole);
  }

  // 5. Verify user has permission for the requested route
  if (clean.startsWith('/admin')) {
    if (userRole !== 'ADMIN' || !isAdminAuthorized) {
      return getRoleDashboard(userRole);
    }
  }
  if (clean.startsWith('/student') && userRole !== 'STUDENT' && userRole !== 'ADMIN') {
    return getRoleDashboard(userRole);
  }
  if (clean.startsWith('/aspirant') && userRole !== 'ASPIRANT' && userRole !== 'ADMIN') {
    return getRoleDashboard(userRole);
  }
  if (clean.startsWith('/alumni') && userRole !== 'ALUMNI' && userRole !== 'ADMIN') {
    return getRoleDashboard(userRole);
  }

  return clean;
}

function runOpenRedirectTests() {
  console.log('--- 5. Open Redirect Protection Tests ---');
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

  // Absolute URL
  const r1 = getSafeRedirectUrl('https://evil.attacker.com', 'STUDENT', false);
  check('Absolute URL deflected to /student/dashboard', r1 === '/student/dashboard');

  // Protocol-relative URL
  const r2 = getSafeRedirectUrl('//evil.attacker.com/malicious', 'STUDENT', false);
  check('Protocol-relative // deflected to /student/dashboard', r2 === '/student/dashboard');

  // Backslash variant
  const r3 = getSafeRedirectUrl('/\\evil.attacker.com', 'STUDENT', false);
  check('Backslash /\\ deflected to /student/dashboard', r3 === '/student/dashboard');

  // javascript: pseudo-protocol
  const r4 = getSafeRedirectUrl('javascript:alert(1)', 'STUDENT', false);
  check('javascript: scheme deflected', r4 === '/student/dashboard');

  // data: URI
  const r5 = getSafeRedirectUrl('data:text/html,<script>alert(1)</script>', 'STUDENT', false);
  check('data: URI scheme deflected', r5 === '/student/dashboard');

  // Encoded slash /%2f
  const r6 = getSafeRedirectUrl('/%2fevil.com', 'STUDENT', false);
  check('Encoded slash %2f deflected', r6 === '/student/dashboard');

  // Auth loop prevention
  const r7 = getSafeRedirectUrl('/auth/login', 'STUDENT', false);
  check('Auth loop /auth/login deflected', r7 === '/student/dashboard');

  // Student trying to redirect to /admin/dashboard
  const r8 = getSafeRedirectUrl('/admin/dashboard', 'STUDENT', false);
  check('Student trying to redirect to /admin deflected', r8 === '/student/dashboard');

  // Unauthorized Admin trying to redirect to /admin/dashboard
  const r9 = getSafeRedirectUrl('/admin/dashboard', 'ADMIN', false);
  check('Unauthorized Admin trying to redirect to /admin deflected', r9 === '/admin/dashboard');

  // Authorized Admin accessing /admin/users
  const r10 = getSafeRedirectUrl('/admin/users', 'ADMIN', true);
  check('Authorized Admin permitted on /admin/users', r10 === '/admin/users');

  // Valid student relative route
  const r11 = getSafeRedirectUrl('/student/marketplace', 'STUDENT', false);
  check('Valid student relative route preserved', r11 === '/student/marketplace');

  console.log(`Open Redirect Score: ${passed}/${total}\n`);
  return { passed, total, ok: passed === total };
}

if (require.main === module) {
  const res = runOpenRedirectTests();
  if (!res.ok) process.exit(1);
}

module.exports = { runOpenRedirectTests };
