import express from "express";
const router = express.Router();
import Randomstring from "randomstring";

import asyncHandler from "../middleware/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { protect } from "../middleware/authMiddleware.js";
import path from "path";
import {
  addCommissionToLineForUpgrade,
  splitterTest,
} from "./supportingFunctions/TreeFunctions.js";
import JoiningRequest from "../models/joinRequestModel.js";
import WithdrawRequest from "../models/withdrawalRequestModel.js";
// import upload from "../middleware/fileUploadMiddleware.js";

// Register new user
// POST: By admin/sponser
const generateRandomString = () => {
  const baseString = "DRM";
  const randomDigits = Math.floor(Math.random() * 999999);
  return baseString + randomDigits.toString();
};

router.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const sponser = req.user._id;

    const ownSponserId = generateRandomString();

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400);
      throw new Error("User already exists!");
    }

    const earning = 0;
    const joiningAmount = 0;
    const children = [];
    const currentPlan = "promoter";
    const thirtyChecker = false;

    const user = await User.create({
      sponser,
      name,
      email,
      password,
      ownSponserId,
      earning,
      joiningAmount,
      children,
      currentPlan,
      thirtyChecker,
    });

    if (user) {
      res.json({
        id: user._id,
        sponser: user.sponser,
        name: user.name,
        email: user.email,
        address: user.address,
        ownSponserId: user.ownSponserId,
        currentPlan: user.currentPlan,
        thirtyChecker: user.thirtyChecker,
      });
    } else {
      res.status(400);
      throw new Error("Registration failed. Please try again!");
    }
  })
);

router.post(
  "/add-user-by-refferal",
  asyncHandler(async (req, res) => {
    const ownSponserId = generateRandomString();

    const { name, email, password, sponser } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400);
      throw new Error("User already exists!");
    }

    const earning = 0;
    const joiningAmount = 0;
    const children = [];
    const currentPlan = "promoter";
    const autoPool = false;
    const thirtyChecker = false;

    const user = await User.create({
      sponser,
      name,
      email,
      password,
      ownSponserId,
      earning,
      joiningAmount,
      children,
      currentPlan,
      autoPool,
      thirtyChecker,
    });

    if (user) {
      res.json({
        id: user._id,
        sponser: user.sponser,
        name: user.name,
        email: user.email,
        address: user.address,
        ownSponserId: user.ownSponserId,
        currentPlan: user.currentPlan,
        thirtyChecker: user.thirtyChecker,
      });
    } else {
      res.status(400);
      throw new Error("Registration failed. Please try again!");
    }
  })
);

// Login user/admin
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && user.password == password) {
      // if (user && (await user.matchPassword(password))) {
      const token = jwt.sign(
        { userId: user._id },
        "secret_of_jwt_for_dreams-meta_5959",
        {
          expiresIn: "800d",
        }
      );

      res.status(200).json({
        _id: user._id,
        sponser: user.sponser,
        name: user.name,
        email: user.email,
        ownSponserId: user.ownSponserId,
        earning: user.earning,
        joiningAmount: user.joiningAmount,
        autoPool: user.autoPool,
        autoPoolPlan: user.autoPoolPlan,
        autoPoolAmount: user.autoPoolAmount,
        userStatus: user.userStatus,
        isAdmin: user.isAdmin,
        children: user.children,
        token_type: "Bearer",
        access_token: token,
        sts: "01",
        msg: "Login Success",
      });
    } else {
      res.status(401).json({ sts: "00", msg: "Login failed" });
    }
  })
);

// GET: User details to that user
router.get(
  "/get-user-details",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId).populate("joiningRequest");

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).json({ sts: "00", msg: "Data fetching failed!" });
    }
  })
);

// Get: upgrade the plan of user if he has enough balance in rejoining amount wallet
router.get(
  "/upgrade-level",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId);
    const admin = await User.findOne({ isAdmin: true });

    if (
      user.joiningAmount >= 60 &&
      user.currentPlan == "promoter" &&
      user.children.length >= 1
    ) {
      user.joiningAmount -= 60;
      admin.rejoiningWallet += 60;
      user.currentPlan = "royalAchiever";

      admin.autoPoolBank += 4;

      if (admin.rewards) {
        admin.rewards += 6;
      } else {
        admin.rewards = 6;
      }

      // Give $8 commission to sponsor as well as people above in the tree till 4 levels
      const sponser = await User.findById(user.sponser);
      
      // Code to add money to sponsor only
      if (!sponser.thirtyChecker) {
        sponser.thirtyChecker = false;
      }

      if (!sponser.totalWallet) {
        sponser.totalWallet = 0;
      }
      
      const splitCommission = splitterTest(
        8,
        sponser,
        sponser.thirtyChecker,
        sponser.currentPlan
      );
      
      sponser.earning = splitCommission.earning;
      sponser.joiningAmount = splitCommission.joining;
      sponser.thirtyChecker = splitCommission.checker;

      if (sponser.currentPlan == "promoter") {
        sponser.totalWallet = Math.min(
          30,
          sponser.totalWallet + splitCommission.addToTotalWallet
        );
      } else if (sponser.currentPlan == "royalAchiever") {
        sponser.totalWallet = Math.min(
          90,
          sponser.totalWallet + splitCommission.addToTotalWallet
        );
      } else if (sponser.currentPlan == "crownAchiever") {
        sponser.totalWallet = Math.min(
          90,
          sponser.totalWallet + splitCommission.addToTotalWallet
        );
      } else if (sponser.currentPlan == "diamondAchiever") {
        sponser.totalWallet = Math.min(
          90,
          sponser.totalWallet + splitCommission.addToTotalWallet
        );
      }

      const updatedSponsor = await sponser.save();
      // Code to add money to sponsor only end
      if (updatedSponsor) {
        await addCommissionToLineForUpgrade(user.nodeId, 3, 8);
      }
    } else if (
      user.joiningAmount >= 100 &&
      user.currentPlan == "royalAchiever" &&
      user.children.length >= 2
    ) {
      user.joiningAmount -= 100;
      user.currentPlan = "crownAchiever";
      admin.rejoiningWallet += 100;

      admin.autoPoolBank += 8;

      if (admin.rewards) {
        admin.rewards += 7;
      } else {
        admin.rewards = 7;
      }

      // Give $15 commission to sponsor
      const sponser = await User.findById(user.sponser);

      // Code to add money to sponsor only
      if (!sponser.thirtyChecker) {
        sponser.thirtyChecker = false;
      }

      if (!sponser.totalWallet) {
        sponser.totalWallet = 0;
      }

      const splitCommission = splitterTest(
        15,
        sponser,
        sponser.thirtyChecker,
        sponser.currentPlan
      );

      sponser.earning = splitCommission.earning;
      sponser.joiningAmount = splitCommission.joining;
      sponser.thirtyChecker = splitCommission.checker;

      if (sponser.currentPlan == "promoter") {
        sponser.totalWallet = Math.min(
          30,
          sponser.totalWallet + splitCommission.addToTotalWallet
        );
      } else if (sponser.currentPlan == "royalAchiever") {
        sponser.totalWallet = Math.min(
          90,
          sponser.totalWallet + splitCommission.addToTotalWallet
        );
      } else if (sponser.currentPlan == "crownAchiever") {
        sponser.totalWallet = Math.min(
          90,
          sponser.totalWallet + splitCommission.addToTotalWallet
        );
      } else if (sponser.currentPlan == "diamondAchiever") {
        sponser.totalWallet = Math.min(
          90,
          sponser.totalWallet + splitCommission.addToTotalWallet
        );
      }

      const updatedSponsor = await sponser.save();
      // Code to add money to sponsor only end

      if (updatedSponsor) {
        await addCommissionToLineForUpgrade(user.nodeId, 3, 15);
      }
    } else if (
      user.joiningAmount >= 200 &&
      (user.currentPlan == "crownAchiever" || "diamondAchiever") &&
      user.children.length >= 3
    ) {
      user.joiningAmount -= 200;
      admin.rejoiningWallet += 200;
      user.currentPlan = "diamondAchiever";

      admin.autoPoolBank += 15;

      if (admin.rewards) {
        admin.rewards += 10;
      } else {
        admin.rewards = 10;
      }

      // Give $30 commission to sponsor
      const sponser = await User.findById(user.sponser);

      // Code to add money to sponsor only
      if (!sponser.thirtyChecker) {
        sponser.thirtyChecker = false;
      }

      if (!sponser.totalWallet) {
        sponser.totalWallet = 0;
      }

      const splitCommission = splitterTest(
        30,
        sponser,
        sponser.thirtyChecker,
        sponser.currentPlan
      );

      sponser.earning = splitCommission.earning;
      sponser.joiningAmount = splitCommission.joining;
      sponser.thirtyChecker = splitCommission.checker;

      if (sponser.currentPlan == "promoter") {
        sponser.totalWallet = Math.min(
          30,
          sponser.totalWallet + splitCommission.addToTotalWallet
        );
      } else if (sponser.currentPlan == "royalAchiever") {
        sponser.totalWallet = Math.min(
          90,
          sponser.totalWallet + splitCommission.addToTotalWallet
        );
      } else if (sponser.currentPlan == "crownAchiever") {
        sponser.totalWallet = Math.min(
          90,
          sponser.totalWallet + splitCommission.addToTotalWallet
        );
      } else if (sponser.currentPlan == "diamondAchiever") {
        sponser.totalWallet = Math.min(
          90,
          sponser.totalWallet + splitCommission.addToTotalWallet
        );
      }

      const updatedSponsor = await sponser.save();
      // Code to add money to sponsor only end
      if (updatedSponsor) {
        await addCommissionToLineForUpgrade(user.nodeId, 3, 30);
      }
    } else {
      res.status(400).json({ msg: "User does not meet upgrade criteria" });
    }

    const updateAdmin = await admin.save();
    const updateUser = await user.save();

    if (updateUser && updateAdmin) {
      res.status(200).json({ msg: "Success" });
    }
  })
);

// Edit profile
router.put(
  "/edit-profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      console.log(updatedUser);

      // const token = jwt.sign(
      //   { userId: user._id },
      //   "secret_of_jwt_for_dreams-meta_5959",
      //   {
      //     expiresIn: "800d",
      //   }
      // );

      res.status(200).json({
        _id: updatedUser._id,
        sponser: updatedUser.sponser,
        name: updatedUser.name,
        email: updatedUser.email,
        ownSponserId: updatedUser.ownSponserId,
        earning: updatedUser.earning,
        joiningAmount: updatedUser.joiningAmount,
        autoPool: updatedUser.autoPool,
        autoPoolPlan: updatedUser.autoPoolPlan,
        autoPoolAmount: updatedUser.autoPoolAmount,
        userStatus: updatedUser.userStatus,
        isAdmin: updatedUser.isAdmin,
        children: updatedUser.children,
        // token_type: "Bearer",
        // access_token: token,
        sts: "01",
        msg: "Login Success",
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

// Get all users under you (sponsored users)
router.get(
  "/get-users",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId).populate("children");
    const sponsors = user.children;

    if (user) {
      res.status(200).json(sponsors);
    } else {
      res.status(400).json({ sts: "00", msg: "Fetching data failed!" });
    }
  })
);

// Function to fetch users at a specific level for a given userId
async function getUsersAtLevel(userId, level) {
  const user = await User.findById(userId);
  if (!user) {
    return [];
  }

  const usersAtLevel = [];
  await findUsersAtLevel(user, level, 1, usersAtLevel);
  return usersAtLevel;
}

// Recursive function to traverse the binary tree and find users at a specific level
async function findUsersAtLevel(user, targetLevel, currentLevel, result) {
  if (!user || currentLevel > targetLevel) {
    return;
  }

  if (currentLevel == targetLevel) {
    result.push(user);
    return;
  }

  try {
    const leftUser = user.left ? await User.findById(user.left) : null;
    const rightUser = user.right ? await User.findById(user.right) : null;

    // Continue traversal
    await findUsersAtLevel(leftUser, targetLevel, currentLevel + 1, result);
    await findUsersAtLevel(rightUser, targetLevel, currentLevel + 1, result);
  } catch (error) {
    console.error(error);
  }
}

router.post(
  "/get-users-by-level",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { level } = req.body;

    const users = await getUsersAtLevel(userId, level);

    if (users) {
      res.json(users);
    } else {
      console.error(error);
      res.status(500).json({ sts: "00", msg: "Some error occured!" });
    }
  })
);

// Receive joining $30 from user
router.post(
  "/join",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const { hash } = req.body;
    const user = await User.findById(userId);

    const joiningRequest = await JoiningRequest.create({
      user: userId,
      amount: 30,
      hash: hash,
      status: false,
    });

    if (joiningRequest) {
      if (user) {
        if (!user.joiningRequest) {
          user.joiningRequest = {};
        }

        user.joiningRequest = joiningRequest._id;

        const updateUser = await user.save();

        if (updateUser) {
          res.status(201).json({
            sts: "01",
            msg: "Your request has been sent successfully!",
          });
        }
      } else {
        res.status(400).json({
          sts: "00",
          msg: "User not found!",
        });
      }
    } else {
      res.status(400).json({
        sts: "00",
        msg: "Some error occured!",
      });
    }
  })
);

// Get user's joining request to user
router.get(
  "/get-joining-request",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId).populate("joiningRequest");

    if (user) {
      res.status(200).json(user.joiningRequest);
    } else {
      res.status(404).json({ sts: "00", msg: "User not found!" });
    }
  })
);

// Request for withdrawal
router.post(
  "/request-withdrawal",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const { amount, walletAddress } = req.body;

    if (!amount || !walletAddress) {
      res.status(400).json({
        sts: "00",
        msg: "Please provide amount and wallet address!",
      });
    }

    const user = await User.findById(userId);

    if (user) {
      if (user.earning >= amount) {
        const withdrawalRequest = await WithdrawRequest.create({
          user: userId,
          amount: amount,
          walletAddress: walletAddress,
          status: false,
          hash: "",
        });

        if (withdrawalRequest) {
          
          user.showWithdraw = false;
          const updatedUser = await user.save();

          if (updatedUser) {
            res.status(201).json({
              sts: "01",
              msg: "Your request has been sent successfully!",
            });
          } else {
            res.status(400).json({
              sts: "00",
              msg: "Some error occured!",
            });
          }
        } else {
          res.status(400).json({
            sts: "00",
            msg: "Some error occured!",
          });
        }
      } else {
        res.status(400).json({
          sts: "00",
          msg: "You don't have enough balance!",
        });
      }
    } else {
      res.status(400).json({
        sts: "00",
        msg: "User not found!",
      });
    }
  })
);

export default router;
