import express from "express";
const router = express.Router();
import Randomstring from "randomstring";

import asyncHandler from "../middleware/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { protect } from "../middleware/authMiddleware.js";
import path from "path";
import { addCommissionToLine } from "./supportingFunctions/TreeFunctions.js";
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

    if (user && (await user.matchPassword(password))) {
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

router.get(
  "/upgrade-plan",
  protect,
  asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (user) {
      if (user.currentPlan == "promoter") {
        if (user.joiningAmount >= 60) {
          user.currentPlan = "royalAchiever";

          user.joiningAmount -= 60;

          if (user.autoPool == true) {
            user.autoPoolPlan = "silverPossession";
          }

          // Give $8 commission to sponsor as well as people above in the tree till 4 levels
          const admin = await User.findById(user.sponser);
          admin.earning += 8;
          await admin.save();

          await addCommissionToLine(user.nodeId, 4, sponserId, 8);

          const updatedUser = await user.save();

          if (updatedUser) {
            res.status(201).json({
              sts: "01",
              msg: "Your plan upgraded successfully.",
            });
          } else {
            res.status(400).json({
              sts: "00",
              msg: "Updating user failed. Please try again!",
            });
          }
        } else {
          res.status(400).json({
            sts: "00",
            msg: "Insufficient amount to upgrade the plan!",
          });
        }
      } else if (currentPlan == "royalAchiever") {
        if (user.joiningAmount >= 100) {
          user.currentPlan = "crownAchiever";
          if (user.autoPool == true) {
            user.autoPoolPlan = "goldPossession";
          }

          // Give $15 commission to sponsor as well as people above in the tree till 4 levels
          const admin = await User.findById(user.sponser);
          admin.earning += 15;
          await admin.save();

          await addCommissionToLine(user.nodeId, 4, sponserId, 15);

          const updatedUser = await user.save();

          if (updatedUser) {
            res.status(201).json({
              sts: "01",
              msg: "Your plan upgraded successfully.",
            });
          } else {
            res.status(400).json({
              sts: "00",
              msg: "Updating user failed. Please try again!",
            });
          }
        } else {
          res.status(400).json({
            sts: "00",
            msg: "Insufficient amount to upgrade the plan!",
          });
        }
      } else if (currentPlan == "crownAchiever") {
        if (user.joiningAmount >= 200) {
          user.currentPlan = "diamondAchiever";
          if (user.autoPool == true) {
            user.autoPoolPlan = "diamondPossession";
          }

          // Give $30 commission to sponsor as well as people above in the tree till 4 levels
          const admin = await User.findById(user.sponser);
          admin.earning += 30;
          await admin.save();

          await addCommissionToLine(user.nodeId, 4, sponserId, 15);

          const updatedUser = await user.save();

          if (updatedUser) {
            res.status(201).json({
              sts: "01",
              msg: "Your plan upgraded successfully.",
            });
          } else {
            res.status(400).json({
              sts: "00",
              msg: "Updating user failed. Please try again!",
            });
          }
        } else {
          res.status(400).json({
            sts: "00",
            msg: "Insufficient amount to upgrade the plan!",
          });
        }
      }
    } else {
      res.status(404).json({ sts: "00", msg: "User not found!" });
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

      const token = jwt.sign(
        { userId: user._id },
        "secret_of_jwt_for_dreams-meta_5959",
        {
          expiresIn: "800d",
        }
      );

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
        token_type: "Bearer",
        access_token: token,
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
