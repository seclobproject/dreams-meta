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
  },
  {
    sponser: null,
    name: "user01",
    email: "user01@gmail.com",
    password: bcrypt.hashSync("pass123", 10),
    isAdmin: false,
    ownSponserId: "DRM789462",
    earning: 0,
    transactions: [],
    userStatus: true,
    children: [],
    currentPlan: "promoter",
    autoPool: false,
  },
  {
    sponser: null,
    name: "user02",
    email: "user02@gmail.com",
    password: bcrypt.hashSync("pass123", 10),
    isAdmin: false,
    ownSponserId: "DRM789463",
    earning: 0,
    transactions: [],
    userStatus: true,
    children: [],
    currentPlan: "promoter",
    autoPool: false,
  },
];

export default users;
