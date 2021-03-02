const express = require("express");
const router = express.Router();
const jwtAuth = require("../middleware/jwtAuth");
const postController = require("../controllers/postController");
const upload = require("../middleware/upload");

router
  .route("/")
  .get(jwtAuth, postController.getPosts)
  .post(jwtAuth, upload.single("image"), postController.createPost);

router.route("/:id").get(jwtAuth, postController.getPost);

module.exports = router;
