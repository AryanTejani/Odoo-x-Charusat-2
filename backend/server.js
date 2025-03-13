import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./db/connectDB.js";
import foodRoute from "./routes/food.route.js"
import authRoutes from "./routes/auth.route.js";
import itemRoutes from "./routes/item.route.js"
import categoryRoutes from "./routes/category.route.js"
import healthRoutes from "./routes/health.route.js"
import workoutRoutes from "./routes/workout.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

app.use("/api/auth", authRoutes);
app.use("/api/item",itemRoutes);
app.use("/api/",categoryRoutes);
app.use("/api/tracker",foodRoute);
app.use("/api/health", healthRoutes);
app.use("/api/workout", workoutRoutes);


if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	connectDB();
	console.log("Server is running on port: ", PORT);
});
