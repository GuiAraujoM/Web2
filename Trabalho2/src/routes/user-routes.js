const { Router } = require("express");
const router = Router();

const UserController = require("../controllers/UserController");
const userController = new UserController();

const PostController = require("../controllers/PostController");
const postController = new PostController();

router.get("/get/:username", (req, res) => {
  userController.getByName(req, res);
});

router.get("/:username", (req, res) => {
  postController.listAllByUsername(req, res);
});

module.exports = router;