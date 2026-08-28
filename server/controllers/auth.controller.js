import User from "../models/user.model.js";
import getToken from "../config/token.js";

import bcrypt from "bcryptjs";

// export const googleAuth = async (req, res) => {
//   try {
//     const { name, email, googleId, profileImage } = req.body;

//     if (!name || !email) {
//       return res.status(400).json({
//         message: "Name and email are required",
//       });
//     }

//     let user = await User.findOne({ email });

//     if (!user) {
//       user = await User.create({
//         name,
//         email,
//         googleId,
//         profileImage,
//         authProvider: "google",
//         isVerified: true,
//       });
//     }

//     const token = getToken(user._id);

//     res.cookie("token",token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     return res.status(200).json({
//       message: "User logged in successfully",
//       user,
//     });
//   } catch (err) {
//     console.error("Google Auth Error:", err);

//     return res.status(500).json({
//       message: "Error logging in user",
//       error: err.message,
//     });
//   }
// };

// export const logout = async (req, res) => {
//   try {
//     res.clearCookie("token");

//     return res.status(200).json({
//       message: "User logged out successfully",
//     });
//   } catch (err) {
//     return res.status(500).json({
//       message: "Error logging out user",
//       error: err.message,
//     });
//   }
// };

// export const getCurrentUser = async (req, res) => {
//   try {
//     const userId = req.userId;

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     return res.status(200).json({ user });
//   } catch (err) {
//     return res.status(500).json({
//       message: "Error fetching user",
//       error: err.message,
//     });
//   }
// };









// =====================================================
// NORMAL SIGNUP
// =====================================================
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      authProvider: "local",
      isVerified: true,
    });

    // Generate JWT
    const token = getToken(user._id);

    // Store JWT in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "Account created successfully",
      user,
    });

  } catch (err) {
    console.error("Signup Error:", err);

    return res.status(500).json({
      message: "Error creating account",
      error: err.message,
    });
  }
};


// =====================================================
// NORMAL LOGIN
// =====================================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.authProvider === "google" && !user.password) {
      return res.status(400).json({
        message:
          "This account was created with Google. Please continue with Google.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT STRING
    const token = getToken(user._id);

    console.log("Generated token:", token);
    console.log("Token type:", typeof token);

    // Store JWT in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user,
    });

  } catch (err) {
    console.error("Login Error:", err);

    return res.status(500).json({
      message: "Error logging in",
      error: err.message,
    });
  }
};


// =====================================================
// GOOGLE AUTH
// =====================================================
export const googleAuth = async (req, res) => {
  try {
    const {
      name,
      email,
      googleId,
      profileImage,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    // Find existing user
    let user = await User.findOne({ email });

    // Create user if doesn't exist
    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        profileImage,
        authProvider: "google",
        isVerified: true,
      });
    } else {
      // Update Google information if necessary
      user.googleId = googleId || user.googleId;
      user.profileImage =
        profileImage || user.profileImage;

      await user.save();
    }

    // Generate JWT
    const token = getToken(user._id);

    // Store JWT in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Google login successful",
      user,
    });

  } catch (err) {
    console.error("Google Auth Error:", err);

    return res.status(500).json({
      message: "Error logging in with Google",
      error: err.message,
    });
  }
};


// =====================================================
// LOGOUT
// =====================================================
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

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


// =====================================================
// GET CURRENT USER
// =====================================================
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });

  } catch (err) {
    console.error("Current User Error:", err);

    return res.status(500).json({
      message: "Error fetching user",
      error: err.message,
    });
  }
};

