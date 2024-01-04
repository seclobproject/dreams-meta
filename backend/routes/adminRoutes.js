import express from "express";
const router = express.Router();

import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import { protect } from "../middleware/authMiddleware.js";

router.post(
  "/verify-user-payment",
  protect,
  asyncHandler(async (req, res) => {
    // const sponserUserId = req.user._id;

    const { userId } = req.body;
    const user = await User.findById(userId);

    if (user) {
      // Approve the user by uploaded screenshots
      user.userStatus = "approved";
      user.imgStatus = "approved";

      // Create/add user to the tree start
      // Find the last user in the binary tree to determine where to add the new user
      const lastUser = await User.findOne({ userStatus: "approved" })
        .sort({ createdAt: -1 })
        .limit(1);

      console.log(`The last user is ${lastUser}`);

      if (lastUser) {
        const sponser = await User.findById(lastUser.sponser);

        console.log(`sponser is ${sponser}`);

        if (sponser) {
          if (!sponser.right) {
            const addUser = await User.findByIdAndUpdate(sponser._id, {
              right: user._id,
            });

            if (addUser) {
              await addUser.save();
            }
          }
        } else {
          if (!lastUser.left) {
            const addUser = await User.findByIdAndUpdate(lastUser._id, {
              left: user._id,
            });

            if (addUser) {
              await addUser.save();
            }
          }
        }
      }

      const updatedUser = await user.save();

      if (updatedUser) {
        res.status(200).json({ message: "Success" });
      } else {
        res.status(401);
        throw new Error("Update failed. Please check again!");
      }
    } else {
      res.status(401);
      throw new Error("Can't find this user. Please check again!");
    }
  })
);

export default router;
