// Seed script to populate the database with initial data
import mongoose from "mongoose";
import "./db.js";
import User from "./model/User.js";
import Attendance from "./model/Attendance.js";

// Wait for DB connection, then seed
setTimeout(async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Attendance.deleteMany({});
    console.log("🗑️  Cleared existing users and attendance");

    // Seed admin
    await User({
      role: "admin",
      name: "Administrator",
      username: "admin",
      password: "admin123",
    }).save();
    console.log("✅ Admin user created (admin / admin123)");

    // Seed faculty
    await User({
      role: "faculty",
      name: "BIJUMON",
      username: "faculty1",
      password: "faculty123",
    }).save();
    console.log("✅ Faculty user created (faculty1 / faculty123)");

    // Seed students
    var students = [
      { role: "student", name: "Ashln", username: "ashln", password: "student123" },
      { role: "student", name: "Sreenanda", username: "sreenanda", password: "student123" },
      { role: "student", name: "Mariya", username: "mariya", password: "student123" },
      { role: "student", name: "Nayna", username: "nayna", password: "student123" },
    ];

    var savedStudents = [];
    for (var student of students) {
      var saved = await User(student).save();
      savedStudents.push(saved);
      console.log(`✅ Student created (${student.username} / ${student.password})`);
    }

    // --- Fake Attendance Data ---
    console.log("\n📅 Generating attendance records...");

    // Generate attendance for the last 15 days
    var today = new Date();
    var attendanceRecords = [];

    for (var i = 1; i <= 15; i++) {
      var date = new Date(today);
      date.setDate(today.getDate() - i);

      // Skip weekends
      var day = date.getDay();
      if (day === 0 || day === 6) continue;

      var dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD

      for (var student of savedStudents) {
        // Randomize attendance: ~80% present
        var isPresent = Math.random() < 0.8;
        attendanceRecords.push({
          date: dateStr,
          studentId: student._id,
          status: isPresent ? "Present" : "Absent",
        });
      }
    }

    await Attendance.insertMany(attendanceRecords);
    console.log(`✅ Created ${attendanceRecords.length} attendance records`);

    // Print summary
    var presentCount = attendanceRecords.filter((r) => r.status === "Present").length;
    var absentCount = attendanceRecords.filter((r) => r.status === "Absent").length;

    console.log("\n🎉 Database seeded successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  Admin:    admin / admin123");
    console.log("  Faculty:  faculty1 / faculty123");
    console.log("  Students: ashln, sreenanda, mariya, nayna / student123");
    console.log(`  Attendance: ${presentCount} present, ${absentCount} absent`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    process.exit(0);
  } catch (error) {
    console.log("❌ Seeding error:", error);
    process.exit(1);
  }
}, 3000);
