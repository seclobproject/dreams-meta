import bcrypt from "bcryptjs";

const users = [
  {
    sponser: null,
    name: "Super Admin",
    email: "seclobclt@gmail.com",
    password: bcrypt.hashSync("pass123", 10),
    isAdmin: true,
    ownSponserId: "7hhmKA1",
    earning: 0,
    transactions: [],
    userStatus: true,
    children: [],
    currentPlan: "promoter",
    autoPool: false,
    rejoiningWallet: 0,
  },
];

export default users;
