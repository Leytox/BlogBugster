import Router from "express";
import authRoute from "./auth.route.js";
import usersRoute from "./users.route.js";
import postsRoute from "./posts.route.js";
import accountRoute from "./account.route.js";
import metricsRoute from "./metrics.route.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/account", accountRoute);
router.use("/users", usersRoute);
router.use("/posts", postsRoute);
router.use("/metrics", metricsRoute);

export default router;
