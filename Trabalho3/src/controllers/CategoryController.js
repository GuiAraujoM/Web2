const { Category } = require("../models/Category");
const { Op, Sequelize } = require("sequelize");
const validateCategoryDto = require("../validators/CategoryValidator");

const { Task } = require("../models/Task");
const { User } = require("../models/User");
const { CategoryUser } = require("../models/CategoryUser");

const UserController = require("./UserController");
const userController = new UserController();

class CategoryController {
  constructor() {
    console.log("Iniciando o Category controller");
  }

  async getById(id) {
    console.log("CategoryController.getById()");
    const category = await Category.findOne({
      where: {
        id: id,
      },
    });

    return category;
  }

  async shareCategory(req, res) {
    console.log("CategoryController.shareCategory()");
    const { id } = req.params;
    const { shareWith } = req.body;

    const categoryFound = await this.getById(id);

    if (!categoryFound) {
      return res
        .status(400)
        .json({ created: false, message: "Invalid category" });
    }

    console.log(categoryFound.owner);

    if (categoryFound.owner !== req.userId) {
      return res.status(403).json({
        created: false,
        message: "You don`t have permission to share this category",
      });
    }

    const now = new Date(Date.now());
    const date_now = `${now.getFullYear()}-${now.getMonth()}-${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    let createdCategoryUser;
    try {
      createdCategoryUser = await CategoryUser.create({
        UserId: shareWith,
        CategoryId: categoryFound.id,
      });
    } catch (error) {
      return res.status(201).send({ created: false, message: "User already have access to this category" });
    }
    

    if (createdCategoryUser) {
      return res.status(201).send({ created: true });
    } else {
      return res.status(500).send({ created: false, message: "Error" });
    }
  }

  async create(req, res) {
    console.log("CategoryController.create()");
    const { name } = req.body;

    const categoryDto = { name, owner: String(req.userId) };

    const error = validateCategoryDto(categoryDto);

    if (error) {
      return res.status(400).json({ created: false, ...error });
    }

    const now = new Date(Date.now());
    const date_now = `${now.getFullYear()}-${now.getMonth()}-${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    const createdCategory = await Category.create({
      owner: req.userId,
      name: name,
      updated_at: date_now,
      created_at: date_now,
    });

    if (createdCategory) {
      return res.status(201).send({ created: true, id: createdCategory.id });
    } else {
      return res.status(500).send({ created: false, message: "Error" });
    }
  }
}

module.exports = CategoryController;
