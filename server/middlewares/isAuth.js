import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    console.log("All cookies:", req.cookies);

    const token = req.cookies?.token;

    console.log("Authentication cookie:", token);
    console.log("Token type:", typeof token);

    if (!token || typeof token !== "string") {
      return res.status(401).json({
        message: "You are not authenticated. Please login again.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("Decoded JWT:", decoded);

    req.userId = decoded.userId;

    next();

  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      message: "You are not authenticated. Please login again.",
    });
  }
};

export default isAuth;