const { Router } = require("express");
const router = Router();

const AuthController = require("../controllers/AuthController");
const controller = new AuthController();

router.post("/register", (req, res) => {
  controller.register(req, res);
});

router.post("/login", (req, res) => {
  controller.login(req, res);
});

module.exports = router;