import jwt from "jsonwebtoken";

export const genrateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.SECRATE_KEY_JWT, { expiresIn: "7d" })
};