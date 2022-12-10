const { Router } = require("express");
const router = Router();

const CategoryController = require("../controllers/CategoryController");
const isAuth = require("../middlewares/isAuth");
const categoryController = new CategoryController();

router.post("/", isAuth, (req, res) => {
    categoryController.create(req, res);
});

router.post("/share/:id", isAuth, (req, res) => {
  categoryController.shareCategory(req, res);
});

module.exports = router;
