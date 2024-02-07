import User from "../../models/userModel.js";

export const bfs = async (startingUser, newUserId, left, right) => {
  // Check if startingUser is null. If so, we don't need to run this function any more. The user is placed on the tree.
  if (!startingUser) {
    return null;
  }

  // Else, we will create a queue to store the users that need to be checked.
  // The starting user at first will be the admin or the sponsor(if the sponsor is verified)
  const queue = [startingUser];

  while (queue.length > 0) {
    // Get the first user in the queue (the user added to the array at first).
    const currentNode = queue.shift();

    // Determine the direction to add the new user. We are adding users from left to right.
    // So the first direction will be left.
    let directionToAdd = left;

    // If the current node has no left, we will add the user to the left.
    if (!currentNode.left) {
      directionToAdd = left;

      // If the current node has no right, we will add the user to the right.
    } else if (!currentNode.right) {
      directionToAdd = right;

      // If the current node has both left and right filled, we will move to the next level.
    } else {
      if (currentNode.left) {
        queue.push(await User.findById(currentNode.left));
      }
      if (currentNode.right) {
        queue.push(await User.findById(currentNode.right));
      }
      continue;
    }

    // Try to add the new user in the determined direction.
    // 'directionToAdd' will have either 'left' or 'right'.
    await User.findByIdAndUpdate(currentNode._id, {
      [directionToAdd]: newUserId,
    });

    // Get sponsor ID to avoid from adding commission twice
    const sponser = await User.findById(newUserId);
    const sponserId = sponser.sponser;

    // const sponserId = null;
    // console.log(`Current node ID: ${currentNode._id}`);
    // console.log(`Sponsor ID: ${sponserId}`);

    // Add commission to everyone in line up to 4 levels above
    if (currentNode.currentPlan == "promoter") {
      await addCommissionToLine(currentNode._id, 3, sponserId, 4);
    } else if (currentNode.currentPlan == "royalAchiever") {
      await addCommissionToLine(currentNode._id, 3, sponserId, 8);
    } else if (currentNode.currentPlan == "crownAchiever") {
      await addCommissionToLine(currentNode._id, 3, sponserId, 15);
    } else if (currentNode.currentPlan == "diamondAchiever") {
      await addCommissionToLine(currentNode._id, 3, sponserId, 30);
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

    const sponsor = await User.findById(sponserId);

    // if (currentUserId.toString() === sponserId.toString() && !sponsor.isAdmin) {
    //   console.log(
    //     "User ID matches Sponsor ID or currentUserId is not defined. Breaking loop."
    //   );
    //   currentUserId = currentUser.nodeId;
    //   currentLevel++;

    //   continue;
    // }

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

// Function to add commission to everyone in line up while level upgrade
export const addCommissionToLineForUpgrade = async (
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

    const sponsor = await User.findById(sponserId);

    if (currentUserId.toString() === sponserId.toString()) {
      //  && !sponsor.isAdmin
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

// Function to split the commission to user betweeen earning wallet and rejoining wallet
export const splitter = async (number, sponser, checker) => {
  const remainingEarningSpace = 30 - sponser.earning;
  const remainingJoiningSpace = 60 - sponser.joining;

  // Add to earning first
  if (remainingEarningSpace > 0 && number > 0 && checker === false) {
    const earningToAdd = Math.min(remainingEarningSpace, number);
    sponser.earning += earningToAdd;
    number -= earningToAdd;

    if (sponser.earning >= 30) {
      checker = true;
    }
  }

  // Add to joining
  if (remainingJoiningSpace > 0 && number > 0 && checker === true) {
    const joiningToAdd = Math.min(remainingJoiningSpace, number);
    sponser.joining += joiningToAdd;
    number -= joiningToAdd;

    if (sponser.joining >= 60) {
      checker = false;
    }
  }

  // Add remaining to earning
  if (number > 0) {
    sponser.earning += number;
  }

  await sponser.save();
  console.log(
    `Earning is ${sponser.earning} and joining is ${sponser.joining}`
  );
};
