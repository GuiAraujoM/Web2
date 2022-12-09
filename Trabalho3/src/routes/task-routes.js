const { Router } = require("express");
const router = Router();

const TaskController = require("../controllers/TaskController");
const isAuth = require("../middlewares/isAuth");
const controller = new TaskController();

router.get("/:id", isAuth, (req, res) => {
  controller.conclude(req, res);
});

router.post("/", isAuth, (req, res) => {
  controller.create(req, res);
});

module.exports = router;
