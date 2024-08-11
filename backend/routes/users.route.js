import Router from "express";
import { adminProtect, userProtect } from "../middleware/auth.middleware.js";
import usersController from "../controllers/users.controller.js";

const router = Router();

router.get("/:id", usersController.getUser);
router.post("/:id/subscribe", userProtect, usersController.subscribe);
router.post("/:id/unsubscribe", userProtect, usersController.unsubscribe);

router.get("/", adminProtect, usersController.getUsers);
router.post("/:id/ban", adminProtect, usersController.ban);
router.post("/:id/unban", adminProtect, usersController.unban);

export default router;
