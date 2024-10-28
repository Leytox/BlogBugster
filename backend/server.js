import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/db.js";
import dotenv from "dotenv";
import apiRoutes from "./routes/index.route.js";
import { notFound } from "./middleware/error.middleware.js";
import morgan from "morgan";
// noinspection ES6UnusedImports
import bot from "./utils/bot.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173"],
    default: "http://localhost:5173",
    sameSite: true,
    credentials: true,
  }),
);
app.use(cookieParser());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

db()
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server is running on port ${process.env.PORT}`),
    );
  })
  .catch((error) => {
    console.error(error);
  });
app.use("/", apiRoutes);
app.use("/server", (req, res) => {
  return res.status(200).send({});
});
app.use("/uploads", express.static("uploads"));
app.use(notFound);
