// import mongoose
import mongoose from "mongoose";

// Connect to MongoDB Atlas (same cluster as employe app, different database)
mongoose
  .connect(
    "mongodb://ASHLN:ashlin@ac-e6xgmtc-shard-00-00.c9yabma.mongodb.net:27017,ac-e6xgmtc-shard-00-01.c9yabma.mongodb.net:27017,ac-e6xgmtc-shard-00-02.c9yabma.mongodb.net:27017/attendance_ams?ssl=true&replicaSet=atlas-1125u6-shard-0&authSource=admin&appName=Cluster0",
  )
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas (attendance_ams)");
  })
  .catch((err) => {
    console.log("❌ MongoDB connection error:", err);
  });
