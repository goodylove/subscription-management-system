import mongoose from "mongoose";
import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";

import generateToken from "../utils/generate-token.js";

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

    const token = generateToken(newUser._id);

    const userWithoutPassword = newUser[0].toJSON();
    console.log(userWithoutPassword);

    session.commitTransaction();
    session.endSession();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: newUser,
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

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      const error = new Error("Invalid password");
      error.status = 401;
      throw error;
    }
    const token = generateToken(user._id);
    

    res.status(200).json({ success: true, token, data: user});
  } catch (error) {
    next(error);
  }
};

export const SignOut = async () => {};
