import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/db.js";
import { config } from "dotenv";
import apiRoutes from "./routes/index.route.js";
import { notFound } from "./middleware/error.middleware.js";

config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

db()
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server is running on port ${process.env.PORT}`),
    );
  })
  .catch((error) => {
    console.error(error);
  });

app.use("/api", apiRoutes);
app.use("/api/uploads", express.static("uploads"));

app.use(notFound);
