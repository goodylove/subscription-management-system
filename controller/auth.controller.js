import mongoose from "mongoose";
import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

export const Signup = async (req, res, next) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const { email, name, password } = req.body;

    // check for existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("User already exist");
      error.statusCode = 409;
      throw error;
    }
    // hash password
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const newUser = await User.create(
      [{ name, email, password: hashPassword }],
      { session }
    );

    const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const { password: _, ...retrieved } = newUser;

    session.commitTransaction();
    session.endSession();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: retrieved,
        token,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
export const SignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    const isMatch = await bcryptjs.compare(password,user.password)
  } catch (error) {
    next(error);
  }
};

export const SignOut = async () => {};
