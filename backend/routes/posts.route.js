import Router from "express";
import postController from "../controllers/posts.controller.js";
import { userProtect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

router
  .route("/")
  .post(
    userProtect,
    upload("uploads/posts").single("image"),
    postController.createPost,
  )
  .get(postController.getPosts);
router
  .route("/:id")
  .get(postController.getPost)
  .put(userProtect, postController.updatePost)
  .delete(userProtect, postController.deletePost);

export default router;
