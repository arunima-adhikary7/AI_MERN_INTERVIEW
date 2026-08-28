import jwt from "jsonwebtoken";

const getToken = (userId) => {
    try {
        const token = jwt.sign(
            { userId },
            process.env.JWTSECRET,
            { expiresIn: "7d" }
        );

        return token;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export default getToken;