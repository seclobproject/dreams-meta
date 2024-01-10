import User from "../../models/userModel.js";

export const addMemberToSecondTree = async (newUserId, startingNodeId) => {
    const queue = [startingNodeId];
  
    while (queue.length > 0) {
      const currentNodeId = queue.shift();
      const currentNode = await User.findById(currentNodeId);
  
      if (!currentNode) {
        continue; // Skip if the current node is not found
      }
  
      // Determine the direction to add the new user in the second tree
      let directionToAdd = "secondLeft";
  
      if (!currentNode.secondLeft) {
        directionToAdd = "secondLeft";
      } else if (!currentNode.secondRight) {
        directionToAdd = "secondRight";
      } else {
        // Both secondLeft and secondRight are filled, move to the next level
        if (currentNode.secondLeft) {
          queue.push(await User.findById(currentNode.secondLeft));
        }
        if (currentNode.secondRight) {
          queue.push(await User.findById(currentNode.secondRight));
        }
        continue;
      }
  
      // Try to add the new user in the determined direction
      await User.findByIdAndUpdate(currentNode._id, {
        [directionToAdd]: newUserId,
      });
  
      return {
        currentNodeId: currentNode._id,
        directionAdded: directionToAdd,
      };
    }
  
    throw new Error("Unable to add user to the second tree");
  };
  