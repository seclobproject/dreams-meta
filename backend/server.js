import express from "express";
import path from "path";
import cors from "cors";

import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
app.use(cors());

// Database connection
import connectDB from "./config/db.js";
connectDB();
// Database connection

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);
app.use(notFound);

const port = process.env.PORT || 6002;

app.listen(port, () => console.log(`Server running in ${port}`));
