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

// router.get("/feed", userProtect, postController.getFeed);

router.get("/user/:userid", postController.getUserPosts);

router
  .route("/:id")
  .get(postController.getPost)
  .put(
    upload("uploads/posts").single("image"),
    userProtect,
    postController.updatePost,
  )
  .delete(userProtect, postController.deletePost);

router.post("/:id/like", userProtect, postController.likePost);
router.post("/:id/unlike", userProtect, postController.unlikePost);
router.post("/:id/comments", userProtect, postController.createComment);
router
  .route("/:id/comments/:commentId")
  .put(userProtect, postController.updateComment)
  .delete(userProtect, postController.deleteComment);
router.get(
  "/:id/comments/:commentId/replies",
  postController.getCommentReplies,
);
router.post(
  "/:id/comments/:commentId/like",
  userProtect,
  postController.likeComment,
);
router.post(
  "/:id/comments/:commentId/unlike",
  userProtect,
  postController.unlikeComment,
);

export default router;
