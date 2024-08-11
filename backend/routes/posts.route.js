import Router from "express";
import postController from "../controllers/posts.controller.js";
import { userProtect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

router
  .route("/")
  .get(postController.getPosts)
  .post(
    userProtect,
    upload("uploads/posts").single("image"),
    postController.createPost,
  );

router
  .route("/:id")
  .get(postController.getPost)
  .put(userProtect, postController.updatePost)
  .delete(userProtect, postController.deletePost);

router.post("/:id/like", userProtect, postController.likePost);
router.post("/:id/unlike", userProtect, postController.unlikePost);
router.post("/:id/comment", userProtect, postController.createComment);
router
  .route("/:id/comment/:commentId")
  .put(userProtect, postController.updateComment)
  .delete(userProtect, postController.deleteComment);

export default router;
