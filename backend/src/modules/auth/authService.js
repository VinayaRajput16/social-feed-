// src/services/authService.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js"; 

const register = async (username, email, password) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already registered");

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ username, email, password: hashed });

  return { id: user._id, username: user.username, email: user.email };
};


const login = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  // issue JWT
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,   // store this in your .env file
    { expiresIn: "1h" }       // token validity
  );

  return token;
};

export default { register, login };
