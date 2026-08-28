import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "User does not have token"
            });
        }

        const verifyToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.userId = verifyToken.userId;

        next();

    } catch (err) {
        return res.status(401).json({
            message: "User is not authorized",
            err: err
        });
    }
};

export default isAuth;