const express = require("express");
const router = express.Router();
const jwtAuth = require("../middleware/jwtAuth");
const postController = require("../controllers/postController");
const upload = require("../middleware/upload");

router
  .route("/")
  .get(jwtAuth, postController.getPosts)
  .post(jwtAuth, upload.single("image"), postController.createPost);

router
  .route("/:id")
  .get(jwtAuth, postController.getPost)
  .patch(jwtAuth, upload.single("image"), postController.updatePost);

router.post("/likePost", jwtAuth, postController.likePost);
router.post("/commentPost", jwtAuth, postController.commentOnPost);

module.exports = router;
