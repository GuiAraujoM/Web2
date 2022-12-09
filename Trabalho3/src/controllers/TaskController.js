const { Task } = require("../models/Task");
const { Op, Sequelize } = require("sequelize");
const validateTaskDto = require("../validators/TaskValidator");

const CategoryController = require("./CategoryController");
const categoryController = new CategoryController();
const UserController = require("./UserController");
const userController = new UserController();

class TaskController {
  constructor() {
    console.log("Iniciando o task controller");
  }

  async create(req, res) {
    console.log("TaskController.create()");
    const { subject, description, due_date, done, owner, category } = req.body;

    const error = validateTaskDto(req.body);

    if (error) {
      return res.status(400).json({ created: false, ...error });
    }

    if (category) {
      const categoryFound = categoryController.getById(category);
      if (!categoryFound) {
        return res
          .status(400)
          .json({ created: false, message: "Invalid category" });
      }
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

    const createdTask = await Task.create({
      subject: subject,
      description: description,
      due_date: due_date,
      done: done,
      owner: owner,
      category: category,
      updated_at: date_now,
      created_at: date_now,
    });

    if (createdTask) {
      return res.status(201).send({ created: true });
    } else {
      return res.status(500).send({ created: false, message: "Error" });
    }
  }

  async conclude(req, res) {
    console.log("TaskController.update()");
    const { id } = req.params;

    const taskFound = this.getById(id);

    if (!taskFound) {
      return res.status(400).json({ created: false, message: "Invalid task" });
    }

    if (taskFound.done) {
      return res
        .status(400)
        .json({ created: false, message: "Task already done" });
    }

    const now = new Date(Date.now());
    const date_now = `${now.getFullYear()}-${now.getMonth()}-${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    const updatedTask = Task.update({
        done: true,
        completed_at: date_now,
        updated_at: date_now,
      },{
        where: {
          id: id,
        },
      }
    );

    if (updatedTask) {
      return res.status(201).send({ success: true });
    } else {
      return res.status(500).send({ success: false, message: "Error" });
    }
  }

  async getById(id) {
    console.log("TaskController.getById()");
    console.log(id)
    const task = await Task.findOne({
      where: {
        id: id
      },
    });

    return task;
  }
}

module.exports = TaskController;
