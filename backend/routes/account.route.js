import Router from "express";
import { userProtect } from "../middleware/auth.middleware.js";
import accountController from "../controllers/account.controller.js";

const router = Router();
router
  .route("/")
  .get(userProtect, accountController.getAccount)
  .put(userProtect, accountController.updateAccount)
  .delete(userProtect, accountController.deleteAccount);

export default router;
