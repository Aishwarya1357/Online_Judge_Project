import { User } from '../models/user.model.js';

export const verifyAdmin = async (req, res, next) => {
  try {
    // req.userId is set by verifyToken middleware
    const currentUser = await User.findById(req.userId);

    if (!currentUser) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!currentUser.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // If admin, proceed to next middleware
    next();

  } catch (error) {
    console.error("Error in verifyAdmin middleware:", error);
    return res.status(500).json({ message: "Server error in admin verification" });
  }
};
