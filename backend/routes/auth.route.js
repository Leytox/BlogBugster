import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify-via-email", authController.verifyViaEmail);
router.post("/verify-account", authController.verifyAccount);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/google", authController.googleOAuth);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);
router.get("/token-validation/:token", authController.isValidToken);

export default router;
