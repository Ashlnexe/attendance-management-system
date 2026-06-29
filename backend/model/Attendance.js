// import mongoose
import mongoose from "mongoose";

// Attendance schema - links a student to a date and status
var attendanceSchema = mongoose.Schema(
  {
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the User model
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Present", "Absent"],
    },
  },
  { timestamps: true }
);

// Ensure a student can only have one attendance record per date
attendanceSchema.index({ date: 1, studentId: 1 }, { unique: true });

// model creation
var Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
