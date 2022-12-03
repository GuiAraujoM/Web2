const { Router } = require("express");
const router = Router();

const PostController = require("../controllers/PostController");
const controller = new PostController();

router.get("/", (req, res) => {
  console.log("rota posts/");
  controller.listAll(req, res);
});

router.get("/search", (req, res) => {
  console.log("rota posts/search");
  controller.listAll(req, res);
});

router.post("/", (req, res) => {
  console.log("rota posts/");
  controller.create(req, res);
});

router.get("/add-post", (req, res) => {
  console.log("rota posts/add-post");
  res.render("create", {});
});

router.post("/:id", (req, res) => {
  console.log(`rota posts/${req.params.id}`);
  controller.edit(req, res);
});

router.get("/:id", (req, res) => {
  console.log(`rota posts/${req.params.id}`);
  controller.detail(req, res);
});

router.get("/page/:page", (req, res) => {
  console.log(`rota posts/page/${req.params.page}`);
  controller.listAll(req, res);
});

router.get("/delete/:id", (req, res) => {
  console.log(`rota posts/dele/${req.params.id}`);
  controller.delete(req, res);
});

router.get("/edit/:id", (req, res) => {
  console.log(`rota posts/edit/${req.params.id}`);
  controller.loadEdit(req, res);
});

module.exports = router;
