// ============================================================
// db.js  –  In-browser localStorage database
// Replaces the Express + MongoDB backend entirely.
// Data persists across page refreshes via localStorage.
// ============================================================

// ─── tiny id generator ───────────────────────────────────────
let _counter = 0;
function generateId() {
  return `${Date.now().toString(36)}_${(++_counter).toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

// ─── storage helpers ─────────────────────────────────────────
const USERS_KEY = 'ams_users';
const ATTENDANCE_KEY = 'ams_attendance';

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getAttendance() {
  return JSON.parse(localStorage.getItem(ATTENDANCE_KEY) || '[]');
}
function saveAttendance(records) {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
}

// ─── seed initial data once ──────────────────────────────────
function seed() {
  if (localStorage.getItem('ams_seeded')) return;

  const now = new Date().toISOString();
  const adminId = generateId();
  const facultyId = generateId();

  const studentDefs = [
    { name: 'Ashln',     username: 'ashln'     },
    { name: 'Sreenanda', username: 'sreenanda' },
    { name: 'Mariya',    username: 'mariya'    },
    { name: 'Nayna',     username: 'nayna'     },
  ];

  const students = studentDefs.map((s) => ({
    _id: generateId(),
    role: 'student',
    name: s.name,
    username: s.username,
    password: 'student123',
    createdAt: now,
    updatedAt: now,
  }));

  const users = [
    { _id: adminId,   role: 'admin',   name: 'Administrator', username: 'admin',    password: 'admin123',   createdAt: now, updatedAt: now },
    { _id: facultyId, role: 'faculty', name: 'BIJUMON',       username: 'faculty1', password: 'faculty123', createdAt: now, updatedAt: now },
    ...students,
  ];
  saveUsers(users);

  // Generate attendance for the last 15 weekdays (~80 % present)
  const today = new Date();
  const attendanceRecords = [];
  for (let i = 1; i <= 15; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (d.getDay() === 0 || d.getDay() === 6) continue; // skip weekends
    const dateStr = d.toISOString().split('T')[0];
    for (const student of students) {
      attendanceRecords.push({
        _id: generateId(),
        date: dateStr,
        studentId: student._id,
        status: Math.random() < 0.8 ? 'Present' : 'Absent',
        createdAt: now,
        updatedAt: now,
      });
    }
  }
  saveAttendance(attendanceRecords);
  localStorage.setItem('ams_seeded', '1');
}

seed(); // runs once on import

// ─── helper: populate studentId field ────────────────────────
function populateStudent(record, users) {
  const user = users.find((u) => u._id === record.studentId);
  return {
    ...record,
    studentId: user ? { _id: user._id, name: user.name, username: user.username } : record.studentId,
  };
}

// ============================================================
// API functions – each returns a Promise so callers await them
// ============================================================

/** POST /api/login */
export async function login({ username, password, role }) {
  const users = getUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password && u.role === role,
  );
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  return user;
}

/** GET /api/users[?role=...] */
export async function fetchUsers(role) {
  const users = getUsers();
  // exclude admin like the original backend
  let result = users.filter((u) => u.role !== 'admin');
  if (role) result = result.filter((u) => u.role === role);
  return result;
}

/** POST /api/users */
export async function createUser(data) {
  const users = getUsers();
  if (users.find((u) => u.username === data.username)) {
    const err = new Error('Username already exists');
    err.status = 400;
    throw err;
  }
  const now = new Date().toISOString();
  const newUser = { _id: generateId(), ...data, createdAt: now, updatedAt: now };
  users.push(newUser);
  saveUsers(users);
  return { message: 'User created successfully' };
}

/** DELETE /api/users/:id */
export async function deleteUser(id) {
  const users = getUsers().filter((u) => u._id !== id);
  saveUsers(users);
  // also remove their attendance
  const records = getAttendance().filter((a) => a.studentId !== id);
  saveAttendance(records);
  return { message: 'User deleted successfully' };
}

/** POST /api/attendance  – body is array of { date, studentId, status } */
export async function saveAttendanceRecords(records) {
  if (!records.length) return { message: 'Nothing to save' };
  const existing = getAttendance().filter((a) => a.date !== records[0].date);
  const now = new Date().toISOString();
  const newRecords = records.map((r) => ({
    _id: generateId(),
    ...r,
    createdAt: now,
    updatedAt: now,
  }));
  saveAttendance([...existing, ...newRecords]);
  return { message: 'Attendance saved successfully' };
}

/** GET /api/attendance[?date=...][?studentId=...] */
export async function fetchAttendance({ date, studentId } = {}) {
  const users = getUsers();
  let records = getAttendance();
  if (date) records = records.filter((a) => a.date === date);
  if (studentId) records = records.filter((a) => a.studentId === studentId);
  return records.map((r) => populateStudent(r, users));
}
