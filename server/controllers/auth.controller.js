import User from "../models/user.model.js";
import getToken from "../config/token.js";

export const googleAuth = async (req, res) => {
  try {
    const { name, email, googleId, profileImage } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        profileImage,
        authProvider: "google",
        isVerified: true,
      });
    }

    const token = getToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User logged in successfully",
      user,
    });
  } catch (err) {
    console.error("Google Auth Error:", err);

    return res.status(500).json({
      message: "Error logging in user",
      error: err.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error logging out user",
      error: err.message,
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching user",
      error: err.message,
    });
  }
};