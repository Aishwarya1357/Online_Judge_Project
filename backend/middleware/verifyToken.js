import jwt from "jsonwebtoken";
import { User } from '../models/user.model.js'; // Fix typo in user import
import dotenv from 'dotenv';
dotenv.config();
export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    console.log("Token from cookies: ", token);
    
    if (!token || token === "undefined") {
        return res.status(401).json({ authenticated: false, message: "No token provided, please login again." });
    }
    try {
        console.log("Verifying token...");
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized-invalid token" });
        }
        req.userId = decoded.userId; // Attach userId to request object
        next();
    } catch (error) {
        console.log("Error in verifyToken middleware: ", error);
        return res.status(401).json({ authenticated: false, message: "Invalid token" });
    }
}

export const verifyAdmin = async (req, res, next) => {
    try {
        const currentUser = await User.findById(req.userId);
        if (!currentUser || !currentUser.isAdmin) {
            return res.status(403).json({ message: "Admins only" });
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: "Server error in verifyAdmin middleware" });
    }
};
