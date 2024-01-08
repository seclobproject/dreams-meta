import express from "express";
const router = express.Router();

import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import { protect } from "../middleware/authMiddleware.js";

// Verify the user by admin and add the user to the proper position in the tree
// after successful verification
// BFS function to assign the user to the tree
const bfs = async (startingUserId, newUserId) => {
  const startingUser = await User.findById(startingUserId);

  if (!startingUser) {
    return null;
  }

  // Queue for BFS
  const queue = [startingUser];

  while (queue.length > 0) {
    const currentNode = queue.shift();

    // Determine the direction to add the new user
    let directionToAdd = "left";

    if (!currentNode.left) {
      directionToAdd = "left";
    } else if (!currentNode.right) {
      directionToAdd = "right";
    } else {
      // Both left and right are filled, move to the next level
      if (currentNode.left) {
        queue.push(await User.findById(currentNode.left));
      }
      if (currentNode.right) {
        queue.push(await User.findById(currentNode.right));
      }
      continue;
    }

    // Try to add the new user in the determined direction
    await User.findByIdAndUpdate(currentNode._id, {
      [directionToAdd]: newUserId,
    });

    // Get sponsor ID to avoid from adding commission twice
    const sponser = await User.findById(newUserId);
    const sponserId = sponser.sponser;
    // Add commission to everyone in line up to 4 levels above
    await addCommissionToLine(currentNode._id, 4, sponserId);

    return {
      currentNodeId: currentNode._id,
      directionAdded: directionToAdd,
    };
  }

  throw new Error("Unable to assign user to the tree");
};

// Function to add commission to everyone in line up to specified levels above
const addCommissionToLine = async (startingUserId, levelsAbove, sponserId) => {
  let currentUserId = startingUserId;
  let currentLevel = 0;

  while (currentUserId && currentLevel <= levelsAbove) {
    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      break;
    }else if(currentUser._id == sponserId){
      continue;
    }

    if (currentUser.earning < 30) {
      const remainingEarningSpace = 30 - currentUser.earning;
      currentUser.earning += Math.min(commissionToAdd, remainingEarningSpace);
      currentUser.upgradeAmount += Math.max(0, commissionToAdd - remainingEarningSpace);
    } else {
      currentUser.upgradeAmount += commissionToAdd;
    }

    // Save the updated user to the database
    await currentUser.save();

    // Move to the parent of the current user
    currentUserId = currentUser.nodeId;
    currentLevel++;
  }
};

router.post(
  "/verify-user-payment",
  protect,
  asyncHandler(async (req, res) => {
    // const sponserUserId = req.user._id;

    const { userId } = req.body;
    const user = await User.findById(userId).populate("sponser");

    if (user) {
      // Approve the user by uploaded screenshots
      user.userStatus = "approved";
      user.imgStatus = "approved";

      // Add $4 commission to sponsor
      if (user.sponser) {
        const sponser = user.sponser;
        sponser.earning += 4;
      }

      const updateTree = await bfs(user.sponser, userId);

      if (updateTree) {
        const attachedNode = updateTree.currentNodeId;
        user.nodeId = attachedNode;
        const updatedUser = await user.save();
        if (updatedUser) {
          res.status(200).json({ sts: "01", message: "Success" });
        } else {
          res
            .status(400)
            .json({ sts: "00", msg: "Error occured while updating!" });
        }
      } else {
        res.status(400).json({ msg: "Error assigning user to the tree" });
      }
    } else {
      res.status(401);
      throw new Error(
        "Can't find this user. Make sure you are registered properly!"
      );
    }
  })
  
);

export default router;
