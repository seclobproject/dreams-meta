import express from "express";
const router = express.Router();

import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import { protect } from "../middleware/authMiddleware.js";

import { addMemberToSecondTree } from './supportingFunctions/addMemberToSecondTree.js'

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
    } else if (currentUser._id == sponserId) {
      continue;
    }

    const commissionToAdd = 4;

    if (currentUser.earning < 30 && currentUser.currentPlan == "promoter") {
      const remainingEarningSpace = 30 - currentUser.earning;
      currentUser.earning += Math.min(commissionToAdd, remainingEarningSpace);
      currentUser.joiningAmount += Math.max(
        0,
        commissionToAdd - remainingEarningSpace
      );
    } else if (
      currentUser.earning < 60 &&
      currentUser.currentPlan == "royalAchiever"
    ) {
      const remainingEarningSpace = 60 - currentUser.earning;
      currentUser.earning += Math.min(commissionToAdd, remainingEarningSpace);
      currentUser.joiningAmount += Math.max(
        0,
        commissionToAdd - remainingEarningSpace
      );
    } else if (
      currentUser.earning < 100 &&
      currentUser.currentPlan == "crownAchiever"
    ) {
      const remainingEarningSpace = 100 - currentUser.earning;
      currentUser.earning += Math.min(commissionToAdd, remainingEarningSpace);
      currentUser.joiningAmount += Math.max(
        0,
        commissionToAdd - remainingEarningSpace
      );
    } else if (
      currentUser.earning < 200 &&
      currentUser.currentPlan == "diamondAchiever"
    ) {
      const remainingEarningSpace = 200 - currentUser.earning;
      currentUser.earning += Math.min(commissionToAdd, remainingEarningSpace);
      currentUser.joiningAmount += Math.max(
        0,
        commissionToAdd - remainingEarningSpace
      );
    } else {
      currentUser.joiningAmount += commissionToAdd;
    }

    if (currentUser.joiningAmount >= 30) {
      await addMemberToSecondTree(currentUser._id, currentUser.nodeId);
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
    const admin = await User.findOne({ isAdmin: true });

    if (user) {
      // Approve the user
      user.userStatus = true;

      // Find the sponser (If OgSponser is not activated, he should be replaced by admin)
      let sponser;
      if (user.sponser) {
        const ogSponser = user.sponser;
        if (ogSponser.userStatus === true) {
          sponser = user.sponser;
          sponser.children.push(user._id);
          sponser.earning += 4;
        } else {
          sponser = admin;
          user.sponser = admin._id;
          sponser.children.push(user._id);
        }
      }

      await sponser.save();
      await user.save();
      const updateTree = await bfs(sponser._id, userId);

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

// GET all users to admin
router.get(
  "/get-users",
  protect,
  asyncHandler(async (req, res) => {
    const users = await User.find()
      .populate("packageChosen")
      .populate("sponser");

    res.json(users);
  })
);

export default router;
