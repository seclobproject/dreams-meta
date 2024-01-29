import express from "express";
import fs from "fs";
const fs1 = fs.promises;
const router = express.Router();

import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import { protect } from "../middleware/authMiddleware.js";
import { bfs } from "./supportingFunctions/TreeFunctions.js";

import path from "path";
import multer from "multer";
import Reward from "../models/rewardModel.js";

// Verify the user by admin and add the user to the proper position in the tree
// after successful verification
// BFS function to assign the user to the tree
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

      // Add $2 to Auto Pool bank of admin
      admin.autoPoolBank += 2;
      const updateAutoPoolBank = await admin.save();

      // Find the sponser (If OgSponser is not activated, he should be replaced by admin)
      let sponser;
      if (user.sponser) {
        const ogSponser = user.sponser;
        if (ogSponser.userStatus === true) {
          sponser = user.sponser;
          if (!sponser.children.includes(user._id)) {
            sponser.children.push(user._id);
          }
          sponser.earning += 4;
        } else {
          sponser = admin;
          user.sponser = admin._id;
          if (!sponser.children.includes(user._id)) {
            sponser.children.push(user._id);
          }
        }
      }

      if (
        sponser.children.length >= 4 &&
        sponser.currentPlan == "promoter" &&
        sponser.autoPool == false
      ) {
        sponser.autoPool = true;
        sponser.autoPoolPlan = "starPossession";
      }

      await sponser.save();
      await user.save();
      const left = "left";
      const right = "right";
      const updateTree = await bfs(sponser, userId, left, right);

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

// Get: upgrade the plan of user if he has enough balance in rejoining amount wallet
router.get(
  "/upgrade-level",
  asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const user = await User.findById(userId);
    const admin = await User.findOne({ isAdmin: true });

    if (user.joiningAmount >= 60 && user.currentPlan == "promoter") {
      user.joiningAmount -= 60;
      user.currentPlan = "royalAchiever";

      admin.autoPoolBank += 4;

      const parentUser = await User.findOne({ currentPlan: "royalAchiever" });
      const left = "royalAchieverLeft";
      const right = "royalAchieverRight";
      await bfs(parentUser, userId, left, right);
    } else if (
      user.joiningAmount >= 100 &&
      user.currentPlan == "royalAchiever"
    ) {
      user.joiningAmount -= 100;
      user.currentPlan = "crownAchiever";

      admin.autoPoolBank += 7.5;

      const parentUser = await User.findOne({ currentPlan: "crownAchiever" });

      const left = "crownAchieverLeft";
      const right = "crownAchieverRight";
      await bfs(parentUser, userId, left, right);
    } else if (
      user.joiningAmount >= 200 &&
      (user.currentPlan == "crownAchiever" || "diamondAchiever")
    ) {
      user.joiningAmount -= 200;
      user.currentPlan = "diamondAchiever";

      admin.autoPoolBank += 15;

      const parentUser = await User.findOne({ currentPlan: "diamondAchiever" });
      const left = "diamondAchieverLeft";
      const right = "diamondAchieverRight";
      await bfs(parentUser, userId, left, right);
    }

    const updateAdmin = await admin.save();
    const updateUser = await user.save();
    if (updateUser) {
      res.status(200).json({ msg: "Success" });
    }
  })
);

// GET all users to admin
router.get(
  "/get-users",
  protect,
  asyncHandler(async (req, res) => {
    const users = await User.find()
      .populate("sponser");

    if (users) {
      res.json(users);
    }
  })
);

// Upload reward image
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e6);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage: storage });

// Upload reward
router.post(
  "/upload-reward",
  protect,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400).json({ msg: "No file uploaded" });
    }

    const existingFile = await Reward.findOne({ fixedValue: "ABC" });

    let image;
    if (existingFile) {
      existingFile.imageName = req.file.filename;
      image = await existingFile.save();
    } else {
      image = await Reward.create({
        imageName: req.file.filename,
      });
    }

    if (image) {
      res.status(200).json({ msg: "Upload success" });
    } else {
      res.status(400).json({ msg: "File upload failed" });
    }
  })
);

// Delete a reward
router.delete(
  "/delete-reward",
  protect,
  asyncHandler(async (req, res) => {
    const existingFile = await Reward.findOne();

    if (existingFile.imageName) {
      existingFile.imageName = null;
      const image = await existingFile.save();

      if (image) {
        res.status(200).json({ msg: "Deleted successfully" });
      } else {
        res.status(400).json({ msg: "Internal server error occured!" });
      }
    } else {
      res.status(400).json({ msg: "No rewards found" });
    }
  })
);

export default router;
