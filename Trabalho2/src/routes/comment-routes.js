const { Router } = require("express");
const router = Router();

const CommentController = require("../controllers/CommentController");
const commentController = new CommentController();

const isNotAuth = require("../middlewares/isNotAuth");

router.post("/", isNotAuth, (req, res) => {
  commentController.createComment(req, res);
});

router.get("/hide/:id", isNotAuth, (req, res) => {
  commentController.hideComment(req, res);
});

module.exports = router;
