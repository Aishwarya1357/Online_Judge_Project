// makeAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/user.model.js"; // ✅ adjust path if needed

dotenv.config(); // Load your MongoDB URI from .env

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const email = "pinky@gmail.com"; // ✅ replace with your actual email

    const result = await User.updateOne(
      { email },
      { $set: { isAdmin: true } }
    );

    if (result.matchedCount === 0) {
      console.log("❌ No user found with that email.");
    } else {
      console.log("✅ User successfully made admin.");
    }

    mongoose.disconnect();
  } catch (err) {
    console.error("🔥 Error making user admin:", err);
    mongoose.disconnect();
  }
};

makeAdmin();
