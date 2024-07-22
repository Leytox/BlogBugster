import Router from "express";
import { adminProtect, userProtect } from "../middleware/auth.middleware.js";
import usersController from "../controllers/users.controller.js";

const router = Router();

router
  .route("/account")
  .get(userProtect, usersController.getAccount)
  .put(userProtect, usersController.updateAccount)
  .delete(userProtect, usersController.deleteAccount);
router.get("/:id", usersController.getUser);
router.get("/", adminProtect, usersController.getUsers);

export default router;
