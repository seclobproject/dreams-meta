import express from "express";
const router = express.Router();
import Randomstring from "randomstring";

import asyncHandler from "../middleware/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { protect } from "../middleware/authMiddleware.js";
import path from "path";
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

// POST: User verification
// After first/fresh user login
// router.post(
//   "/verify-user",
//   protect,
//   upload.single("image"),
//   asyncHandler(async (req, res) => {
//     if (!req.file) {
//       res.status(400).json({ message: "No file uploaded" });
//     }

//     const filePath = req.file.path;

//     const { referenceNo } = req.body;

//     const userId = req.user._id;

//     const user = await User.findById(userId);

//     if (user) {
//       user.screenshot = req.file.filename;
//       user.referenceNo = referenceNo;
//       user.imgStatus = "progress";

//       const updatedUser = await user.save();
//       if (updatedUser) {
//         res.status(201).json({
//           updatedUser,
//           sts: "01",
//           msg: "User verification in progress!",
//         });
//       } else {
//         res
//           .status(400)
//           .json({ sts: "00", msg: "Verification failed. Please try again!" });
//       }
//     } else {
//       res.status(401);
//       throw new Error("User not found");
//     }
//   })
// );

// Verify user by admin after the payment screenshot received
// POST: Only for admin/sponser
// const splitCommissions = async (user, amount, levels, percentages) => {
//   if (!user || levels === 0) {
//     return;
//   }

//   const commission = (percentages[0] / 100) * amount;
//   const sponser = await User.findById(user.sponser);

//   if (sponser) {
//     if (sponser.children.length >= 4) {
//       sponser.earning = Math.round((sponser.earning + commission) * 10) / 10;

//       sponser.allTransactions.push({
//         name: "Commission credited",
//         amount: commission,
//         status: "approved",
//       });
//     } else if (sponser.children.length === 2 && percentages[0] === 8) {
//       sponser.earning = Math.round((sponser.earning + commission) * 10) / 10;

//       sponser.allTransactions.push({
//         name: "Commission credited",
//         amount: commission,
//         status: "approved",
//       });
//     } else if (sponser.children.length === 3 && percentages[0] === 5) {
//       sponser.earning = Math.round((sponser.earning + commission) * 10) / 10;

//       sponser.allTransactions.push({
//         name: "Commission credited",
//         amount: commission,
//         status: "approved",
//       });
//     } else {
//       sponser.unrealisedEarning.push(commission);
//     }

//     await sponser.save();
//     splitCommissions(sponser, amount, levels - 1, percentages.slice(1));
//   }
// };

// Function to find the highest unrealised commission and add it to wallet
// const unrealisedToWallet = (arr) => {
//   if (arr.length === 0) {
//     return 0;
//   }
//   const highestNumber = Math.max(...arr);
//   const highestNumbers = arr.filter((num) => num === highestNumber);
//   const sum = highestNumbers.reduce((acc, num) => acc + num, 0);
//   return sum;
// };

// POST: Reject user verification
// By super admin
// router.post(
//   "/reject-user",
//   protect,
//   asyncHandler(async (req, res) => {
//     const { userId } = req.body;
//     const user = await User.findById(userId);

//     if (user) {
//       user.userStatus = "pending";
//       user.imgStatus = "pending";

//       const updatedUser = await user.save();

//       if (updatedUser) {
//         res.status(200).json({ msg: "User verification rejected!" });
//       }
//     } else {
//       res.status(404).json({ msg: "User not found!" });
//     }
//   })
// );

// GET: All users to admin (under that specific admin with his referralID)

// const addPackages = async (childrenArray) => {
//   let result = [];

//   for (const child of childrenArray) {
//     const user = await User.findById(child._id).populate("packageChosen");

//     let packageChosen;
//     if (user.packageChosen) {
//       packageChosen = user.packageChosen;
//     }

//     if (user) {
//       result.push({
//         _id: child._id,
//         name: child.name,
//         sponserId: child.ownSponserId,
//         phone: child.phone,
//         email: child.email,
//         address: child.address,
//         userStatus: child.userStatus,
//         packageName: packageChosen && packageChosen.name,
//         packageAmount: packageChosen && packageChosen.amount,
//         packageType: packageChosen && packageChosen.schemeType,
//       });
//     }
//   }

//   return result;
// };

// router.get(
//   "/get-my-users",
//   protect,
//   asyncHandler(async (req, res) => {
//     const userId = req.user._id;

//     const users = await User.findById(userId).populate("children");

//     if (!users) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const childrenArray = users.children || [];

//     const result = await addPackages(childrenArray);

//     if (childrenArray.length === 0) {
//       res.status(200).json({
//         sts: "00",
//         message: "No members found under you!",
//         userStatus: users.userStatus,
//         result,
//       });
//     } else {
//       res.status(200).json({ result, userStatus: users.userStatus });
//     }
//   })
// );

// GET: Get your users by ID
// router.get(
//   "/get-user-by-id/:id",
//   protect,
//   asyncHandler(async (req, res) => {
//     const { id } = req.params;

//     const user = await User.findById(id)
//       .populate("children")
//       .populate("sponser")
//       .populate("packageChosen");

//     const childrenArray = user.children || [];

//     const updatedArray = await Promise.all(
//       childrenArray.map(async (child) => {
//         const packageSelected = await Package.findById(
//           child.packageChosen
//         ).lean();

//         if (packageSelected) {
//           const modifiedObject = {
//             ...child,
//             packageSelected: packageSelected.name,
//             packageAmount: packageSelected.amount,
//             schemeType: packageSelected.schemeType,
//           };

//           // Remove Mongoose metadata
//           delete modifiedObject.__v;
//           delete modifiedObject._id;
//           delete modifiedObject.$__;
//           delete modifiedObject.$isNew;

//           return modifiedObject;
//         } else {
//           return null;
//         }
//       })
//     );

//     let members;

//     if (updatedArray) {
//       members = updatedArray.map((obj) => ({
//         ...obj._doc,
//         packageSelected: obj.packageSelected,
//         packageAmount: obj.packageAmount,
//         schemeType: obj.schemeType,
//       }));
//     }

//     if (members) {
//       res.status(200).json({
//         sponserUser: user,
//         members,
//       });
//     } else {
//       res.status(400).json({ sts: "00", message: "Members not found" });
//     }
//   })
// );

// POST: Fetch profile of the user
// Access to admin/user
// router.post(
//   "/fetch-profile",
//   protect,
//   asyncHandler(async (req, res) => {
//     const userId = req.user._id;

//     const user = await User.findById(userId).populate("packageChosen");

//     if (user) {
//       res.json({
//         _id: user._id,
//         sponser: user.sponser,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         address: user.address,
//         ownSponserId: user.ownSponserId,
//         screenshot: user.screenshot,
//         referenceNo: user.referenceNo,
//         earning: user.earning,
//         unrealisedEarning: user.unrealisedEarning,
//         userStatus: user.userStatus,
//         imgStatus: user.imgStatus,
//         packageChosen: user.packageChosen && user.packageChosen.amount,
//         sts: "01",
//         msg: "Profile fetched successfully",
//       });
//     } else {
//       res.status(401).json({ sts: "00", msg: "User not found" });
//     }
//   })
// );

// PUT: Change password
// Access to admin/user
// router.put(
//   "/change-password",
//   protect,
//   asyncHandler(async (req, res) => {
//     const userId = req.user._id;

//     const user = await User.findById(userId);

//     const { password } = req.body;
//     if (user) {
//       user.password = password;
//       const updatedUser = user.save();

//       if (updatedUser) {
//         res
//           .status(200)
//           .json({ sts: "01", msg: "Password changed successfully!" });
//       } else {
//         res.status(401).json({ sts: "00", msg: "Password changing failed!" });
//       }
//     }
//   })
// );

// PUT: Edit Profile for super admin
// Access to super admin
// router.put(
//   "/edit-profile",
//   protect,
//   asyncHandler(async (req, res) => {
//     const user = await User.findById(req.body.user_Id);

//     if (user) {
//       user.name = req.body.name || user.name;
//       user.email = req.body.email || user.email;
//       user.phone = req.body.phone || user.phone;
//       user.address = req.body.address || user.address;
//       user.packageChosen = req.body.packageChosen || user.packageChosen;

//       if (req.body.password) {
//         user.password = req.body.password;
//       }

//       const updatedUser = await user.save();

//       res.json({
//         _id: updatedUser._id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         phone: updatedUser.phone,
//       });
//     } else {
//       res.status(404);
//       throw new Error("User not found");
//     }
//   })
// );

// GET: Upgrade plan from current to next level

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

export default router;
