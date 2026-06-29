// import express
import express from "express";
import cors from "cors";
import "./db.js";
import User from "./model/User.js";
import Attendance from "./model/Attendance.js";

// initialize express
var app = express();

// middleware
app.use(express.json());
app.use(cors());

// ==================== API ROUTES ====================

// 1. Authentication (Login)
app.post("/api/login", async (req, res) => {
  try {
    var { username, password, role } = req.body;
    var user = await User.findOne({ username, password, role });
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Get all users (exclude admin) - for Admin & Faculty views
app.get("/api/users", async (req, res) => {
  try {
    var roleFilter = req.query.role;
    var filter = { role: { $ne: "admin" } };
    if (roleFilter) {
      filter.role = roleFilter;
    }
    var users = await User.find(filter);
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Create a new user (Admin capability)
app.post("/api/users", async (req, res) => {
  try {
    await User(req.body).save();
    res.json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Delete a user (Admin capability)
app.delete("/api/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    // Also delete their attendance records
    await Attendance.deleteMany({ studentId: req.params.id });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// 5. Mark Attendance (Faculty capability) - saves/updates records for a date
app.post("/api/attendance", async (req, res) => {
  try {
    var records = req.body; // Array of { date, studentId, status }
    if (records.length > 0) {
      // Delete existing records for the given date to allow re-marking
      await Attendance.deleteMany({ date: records[0].date });
      await Attendance.insertMany(records);
    }
    res.json({ message: "Attendance saved successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// 6. Get Attendance Records (with optional filters)
app.get("/api/attendance", async (req, res) => {
  try {
    var filter = {};
    if (req.query.date) filter.date = req.query.date;
    if (req.query.studentId) filter.studentId = req.query.studentId;
    var records = await Attendance.find(filter).populate("studentId", "name username");
    res.json(records);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// server in listening mode
var port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 AMS server is running on port ${port}`);
});
