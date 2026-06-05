import userService from "./userService.js";

export const getProfile = async (req, res, next) => {
  try {
    // id from JWT (authMiddleware sets req.user)
    const user = await userService.getProfile(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (error) {
    next(error);
  }
};
