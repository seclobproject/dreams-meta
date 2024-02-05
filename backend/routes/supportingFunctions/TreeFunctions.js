import User from "../../models/userModel.js";

export const bfs = async (startingUser, newUserId, left, right) => {
  if (!startingUser) {
    return null;
  }

  // Queue for BFS
  const queue = [startingUser];

  while (queue.length > 0) {
    const currentNode = queue.shift();

    // Determine the direction to add the new user
    let directionToAdd = left;

    if (!currentNode.left) {
      directionToAdd = left;
    } else if (!currentNode.right) {
      directionToAdd = right;
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
    if (currentNode.currentPlan == "promoter") {
      await addCommissionToLine(currentNode._id, 4, sponserId, 4);
    } else if (currentNode.currentPlan == "royalAchiever") {
      await addCommissionToLine(currentNode._id, 4, sponserId, 8);
    } else if (currentNode.currentPlan == "crownAchiever") {
      await addCommissionToLine(currentNode._id, 4, sponserId, 15);
    } else if (currentNode.currentPlan == "diamondAchiever") {
      await addCommissionToLine(currentNode._id, 4, sponserId, 30);
    }

    return {
      currentNodeId: currentNode._id,
      directionAdded: directionToAdd,
    };
  }

  throw new Error("Unable to assign user to the tree");
};

// Function to add commission to everyone in line up to specified levels above
export const addCommissionToLine = async (
  startingUserId,
  levelsAbove,
  sponserId,
  commissionAmount
) => {
  let currentUserId = startingUserId;
  let currentLevel = 0;

  while (currentUserId && currentLevel <= levelsAbove) {
    if (!currentUserId) {
      break;
    }
    const currentUser = await User.findById(currentUserId);

    if (currentUserId.toString() === sponserId.toString()) {
      console.log(
        "User ID matches Sponsor ID or currentUserId is not defined. Breaking loop."
      );
      currentUserId = currentUser.nodeId;
      currentLevel++;

      continue;
    }

    const commissionToAdd = commissionAmount;

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

    // Save the updated user to the database
    await currentUser.save();

    // Move to the parent of the current user

    currentUserId = currentUser.nodeId;
    currentLevel++;
  }
};
