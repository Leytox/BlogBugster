import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/db.js";
import {config} from "dotenv";
import apiRoutes from "./routes/index.route.js";
import {notFound} from "./middleware/error.middleware.js";
import morgan from "morgan";

config();

const app = express();

app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb', extended: true}));
app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    }),
);
app.use(cookieParser());
app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms"),
);

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
