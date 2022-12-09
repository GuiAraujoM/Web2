const { Category } = require("../models/Category");
const { Op } = require("sequelize");
const validateCategoryDto = require("../validators/CategoryValidator");

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

  async create(req, res) {
    console.log("CategoryController.create()");
    const { name, owner } = req.body;

    const categoryDto = {name, owner};

    const error = validateCategoryDto(categoryDto);

    if (error) {
      return res.status(400).json({ created: false, ...error });
    }

    if (owner) {
      const ownerFound = userController.getById(owner);
      if (!ownerFound) {
        return res
          .status(400)
          .json({ created: false, message: "Invalid owner" });
      }
    }

    const now = new Date(Date.now());
    const date_now = `${now.getFullYear()}-${now.getMonth()}-${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    const createdCategory = await Category.create({
      owner: owner,
      name: name,
      updated_at: date_now,
      created_at: date_now,
    })

    if (createdCategory) {
      return res.status(201).send({ created: true });
    } else {
      return res.status(500).send({ created: false, message: "Error" });
    }
  }
}

module.exports = CategoryController;
