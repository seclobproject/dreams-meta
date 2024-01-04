// binaryTree.js

import User from "../models/userModel.js";

class TreeNode {
  constructor(user) {
    this.user = user;
    this.left = null;
    this.right = null;
  }
}

class BinaryTree {
  constructor() {
    this.root = null;
  }

  async addUser(user) {
    const newNode = new TreeNode(user);

    if (!this.root) {
      this.root = newNode;
    } else {
      // Find the first available spot on the next level of the tree
      const queue = [this.root];
      while (queue.length > 0) {
        const currentNode = queue.shift();

        if (!currentNode.left) {
          const leftChild = await User.findById(currentNode.user._id);
          leftChild.rightChild = user._id;
          await leftChild.save();
          currentNode.left = newNode;
          break;
        } else if (!currentNode.right) {
          const rightChild = await User.findById(currentNode.user._id);
          rightChild.leftChild = user._id;
          await rightChild.save();
          currentNode.right = newNode;
          break;
        }

        // Add the children to the queue for further exploration
        if (currentNode.left) queue.push(currentNode.left);
        if (currentNode.right) queue.push(currentNode.right);
      }
    }
  }

  getTreeStructure() {
    return this.root;
  }
}

export default BinaryTree;
