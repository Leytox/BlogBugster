import Router from "express";
import { userProtect } from "../middleware/auth.middleware.js";
import accountController from "../controllers/account.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();
router
  .route("/")
  .get(userProtect, accountController.getAccount)
  .put(userProtect, accountController.updateAccount)
  .delete(userProtect, accountController.deleteAccount);
router
  .route("/avatar")
  .post(
    userProtect,
    upload("uploads/users").single("avatar"),
    accountController.uploadImage,
  )
  .delete(userProtect, accountController.deleteImage);
export default router;
