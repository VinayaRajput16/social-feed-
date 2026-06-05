import User from "../../models/User.js";

const getProfile = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password"); // exclude password
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default { getProfile };
