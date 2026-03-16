const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve uploaded files statically
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use("/uploads", express.static(uploadDir));

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ─── In-memory DB ─────────────────────────────────────────
let users = [
  { id: "s1", name: "Arjun Mehta",    email: "arjun@git.edu",  password: "student123", role: "student", rollNo: "22CS001", dept: "CSE", batch: "CSE-A 2022", cgpa: "8.7", mentorId: "f1" },
  { id: "s2", name: "Sneha Patil",    email: "sneha@git.edu",  password: "student123", role: "student", rollNo: "22CS002", dept: "CSE", batch: "CSE-A 2022", cgpa: "9.1", mentorId: "f1" },
  { id: "s3", name: "Rahul Desai",    email: "rahul@git.edu",  password: "student123", role: "student", rollNo: "22CS003", dept: "CSE", batch: "CSE-B 2022", cgpa: "7.8", mentorId: "f1" },
  { id: "f1", name: "Dr. Priya Sharma",   email: "priya@git.edu",  password: "faculty123", role: "faculty", dept: "CSE" },
  { id: "f2", name: "Prof. Anand Kulkarni", email: "anand@git.edu", password: "faculty123", role: "faculty", dept: "ECE" },
  { id: "a1", name: "Admin Office",   email: "admin@git.edu",  password: "admin123",   role: "admin" },
];

let batches = [
  { id: "b1", name: "CSE-A 2022", dept: "CSE", year: "4th Year", facultyId: "f1", studentIds: ["s1", "s2"] },
  { id: "b2", name: "CSE-B 2022", dept: "CSE", year: "4th Year", facultyId: "f1", studentIds: ["s3"] },
  { id: "b3", name: "ECE-A 2023", dept: "ECE", year: "3rd Year", facultyId: "f2", studentIds: [] },
];

let achievements = [
  { id: uuid(), studentId: "s1", title: "IEEE Paper Presentation", category: "Conference", org: "IEEE", date: "2025-11-10", description: "Presented paper on ML in IoT", status: "approved", fileUrl: null, facultyId: "f1", createdAt: "2025-11-10" },
  { id: uuid(), studentId: "s1", title: "Coding Club Lead",        category: "Leadership",  org: "GIT",  date: "2025-08-01", description: "Led the college coding club",  status: "approved", fileUrl: null, facultyId: "f1", createdAt: "2025-08-01" },
  { id: uuid(), studentId: "s1", title: "AWS Cloud Practitioner",  category: "Certification", org: "Amazon", date: "2025-12-10", description: "Cloud foundations cert",   status: "pending",  fileUrl: null, facultyId: null, createdAt: "2025-12-10" },
  { id: uuid(), studentId: "s2", title: "Smart India Hackathon 2025", category: "Competition", org: "GOI", date: "2026-01-15", description: "National level hackathon finalist", status: "pending", fileUrl: null, facultyId: null, createdAt: "2026-01-15" },
  { id: uuid(), studentId: "s2", title: "Google Data Analytics",   category: "Certification", org: "Google", date: "2025-11-20", description: "6-course data analytics cert", status: "approved", fileUrl: null, facultyId: "f1", createdAt: "2025-11-20" },
  { id: uuid(), studentId: "s3", title: "NSS Community Drive",     category: "Community Service", org: "NSS", date: "2025-10-05", description: "100 hours of community service", status: "pending", fileUrl: null, facultyId: null, createdAt: "2025-10-05" },
];

// ─── Auth ─────────────────────────────────────────────────
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

// ─── Achievements ─────────────────────────────────────────
// Get all achievements for a student
app.get("/api/achievements", (req, res) => {
  const { studentId, status, facultyId } = req.query;
  let list = [...achievements];
  if (studentId) list = list.filter(a => a.studentId === studentId);
  if (status)    list = list.filter(a => a.status === status);
  if (facultyId) {
    // get all students under this faculty's batches
    const batch = batches.filter(b => b.facultyId === facultyId);
    const sIds = batch.flatMap(b => b.studentIds);
    list = list.filter(a => sIds.includes(a.studentId));
  }
  // Attach student name
  list = list.map(a => {
    const s = users.find(u => u.id === a.studentId);
    return { ...a, studentName: s ? s.name : "Unknown", rollNo: s ? s.rollNo : "" };
  });
  res.json(list);
});

// Submit new achievement
app.post("/api/achievements", upload.single("file"), (req, res) => {
  const { studentId, title, category, org, date, description } = req.body;
  if (!studentId || !title || !category) return res.status(400).json({ error: "Missing required fields" });
  const ach = {
    id: uuid(),
    studentId,
    title,
    category,
    org: org || "",
    date: date || new Date().toISOString().split("T")[0],
    description: description || "",
    status: "pending",
    fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
    facultyId: null,
    createdAt: new Date().toISOString().split("T")[0],
  };
  achievements.push(ach);
  res.status(201).json(ach);
});

// Approve / Reject
app.patch("/api/achievements/:id", (req, res) => {
  const ach = achievements.find(a => a.id === req.params.id);
  if (!ach) return res.status(404).json({ error: "Not found" });
  const { status, facultyId } = req.body;
  if (!["approved", "rejected"].includes(status)) return res.status(400).json({ error: "Invalid status" });
  ach.status = status;
  ach.facultyId = facultyId || ach.facultyId;
  res.json(ach);
});

// Delete achievement
app.delete("/api/achievements/:id", (req, res) => {
  const idx = achievements.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  achievements.splice(idx, 1);
  res.json({ success: true });
});

// ─── Batches ──────────────────────────────────────────────
app.get("/api/batches", (req, res) => {
  const { facultyId } = req.query;
  let list = facultyId ? batches.filter(b => b.facultyId === facultyId) : batches;
  list = list.map(b => {
    const faculty = users.find(u => u.id === b.facultyId);
    const pending = achievements.filter(a => b.studentIds.includes(a.studentId) && a.status === "pending").length;
    return { ...b, facultyName: faculty ? faculty.name : "Unassigned", studentCount: b.studentIds.length, pendingCount: pending };
  });
  res.json(list);
});

app.post("/api/batches", (req, res) => {
  const { name, dept, year, facultyId } = req.body;
  if (!name || !dept) return res.status(400).json({ error: "Name and dept required" });
  const batch = { id: uuid(), name, dept, year: year || "1st Year", facultyId: facultyId || null, studentIds: [] };
  batches.push(batch);
  res.status(201).json(batch);
});

app.patch("/api/batches/:id/assign", (req, res) => {
  const batch = batches.find(b => b.id === req.params.id);
  if (!batch) return res.status(404).json({ error: "Batch not found" });
  batch.facultyId = req.body.facultyId;
  res.json(batch);
});

// ─── Students ─────────────────────────────────────────────
app.get("/api/students", (req, res) => {
  const { facultyId, batchId } = req.query;
  let studentList = users.filter(u => u.role === "student");
  if (batchId) {
    const b = batches.find(b => b.id === batchId);
    if (b) studentList = studentList.filter(s => b.studentIds.includes(s.id));
  }
  if (facultyId) {
    const myBatches = batches.filter(b => b.facultyId === facultyId);
    const sIds = myBatches.flatMap(b => b.studentIds);
    studentList = studentList.filter(s => sIds.includes(s.id));
  }
  studentList = studentList.map(({ password: _, ...s }) => {
    const achCount = achievements.filter(a => a.studentId === s.id).length;
    const verCount = achievements.filter(a => a.studentId === s.id && a.status === "approved").length;
    return { ...s, achievementCount: achCount, verifiedCount: verCount };
  });
  res.json(studentList);
});

// ─── Admin stats ──────────────────────────────────────────
app.get("/api/admin/stats", (req, res) => {
  const totalStudents = users.filter(u => u.role === "student").length;
  const totalFaculty  = users.filter(u => u.role === "faculty").length;
  const totalAchs     = achievements.length;
  const approved      = achievements.filter(a => a.status === "approved").length;
  const pending       = achievements.filter(a => a.status === "pending").length;
  const byCategory    = {};
  achievements.forEach(a => { byCategory[a.category] = (byCategory[a.category] || 0) + 1; });
  res.json({ totalStudents, totalFaculty, totalAchs, approved, pending, totalBatches: batches.length, byCategory });
});

// Health
app.get("/api/health", (req, res) => res.json({ status: "ok", uptime: process.uptime().toFixed(1) + "s" }));

app.listen(PORT, () => console.log(`✅  SSH Backend running → http://localhost:${PORT}`));
