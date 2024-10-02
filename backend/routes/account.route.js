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
    accountController.uploadAvatar,
  )
  .delete(userProtect, accountController.deleteAvatar);
router.post("/verify-password", userProtect, accountController.verifyPassword);
router.post("/change-password", userProtect, accountController.changePassword);
router.post(
  "/generate-2fa-token",
  userProtect,
  accountController.generate2FAToken,
);
router.post("/enable-2fa", userProtect, accountController.enable2FA);
router.post("/disable-2fa", userProtect, accountController.disable2FA);

export default router;
