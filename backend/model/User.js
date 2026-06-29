// import mongoose
import mongoose from "mongoose";

// User schema - handles all roles (student, faculty, admin)
var userSchema = mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ["student", "faculty", "admin"],
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// model creation
var User = mongoose.model("User", userSchema);
export default User;
