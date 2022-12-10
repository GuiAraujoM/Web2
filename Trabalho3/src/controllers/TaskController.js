const { Op, Sequelize } = require("sequelize");
const validateTaskDto = require("../validators/TaskValidator");

const { Task } = require("../models/Task");
const { User } = require("../models/User");
const { Category } = require("../models/Category");
const { CategoryUser } = require("../models/CategoryUser");

const CategoryController = require("./CategoryController");
const categoryController = new CategoryController();
const UserController = require("./UserController");
const userController = new UserController();

class TaskController {
  constructor() {
    console.log("Iniciando o task controller");
  }

  async listAll(req, res) {
    console.log("TaskController.listAll()");
    let { page, overdue, pending } = req.query;
    
    const userCategories = await CategoryUser.findAll({
      attributes: ["CategoryId"],
      where: {
        UserId: req.userId,
      },
    });

    const categoryIds = userCategories.map(userCategory => userCategory.CategoryId );

    const where = {
      [Op.or]: [
        {
          category: { [Op.in]: [categoryIds] },
        },
        {
          [Op.and]: [
            {
              category: { [Op.is]: null },
              owner: req.userId,
            },
          ],
        },
      ],
    }

    if(overdue){
      const now = new Date(Date.now());
      const date_now = `${now.getFullYear()}-${now.getMonth()}-${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      where.due_date = { [Op.lt]: date_now }
      where.done = false;
    }

    if(pending){
      where.done = false;
    }

    if( !page ){ page = 0; } else { 5 * page };
    
    const result = await Task.findAndCountAll({
      where: where,
      offset: 5 * page,
      limit: 5,
      order: [["created_at", "DESC"]],
    });

    return res
      .status(200)
      .json({
        page: page,
        limit: 5,
        total: result.count,
        data: result.rows,
       });
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
      return res.status(201).send({ created: true, id: createdTask.id });
    } else {
      return res.status(500).send({ created: false, message: "Error" });
    }
  }

  async conclude(req, res) {
    console.log("TaskController.conclude()");
    const { id } = req.params;

    const taskFound = await this.getById(id);

    const isOwner = await this.isTaskOwner(req.userId, id);
    
    if(!isOwner){
      return res.status(403).json({ success: false, message: "You don`t have access to this task" });
    }

    if (!taskFound) {
      return res.status(400).json({ success: false, message: "Invalid task" });
    }

    if (taskFound.done == 1) {
      return res
        .status(400)
        .json({ success: false, message: "Task already done" });
    }

    const now = new Date(Date.now());
    const date_now = `${now.getFullYear()}-${now.getMonth()}-${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    const updatedTask = Task.update(
      {
        done: true,
        completed_at: date_now,
        updated_at: date_now,
      },
      {
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
    const task = await Task.findOne({
      where: {
        id: id
      },
    });

    return task;
  }

  async isTaskOwner(userId, taskId){
    console.log("TaskController.isTaskOwner()");
    const userCategories = await CategoryUser.findAll({
      attributes: ["CategoryId"],
      where: {
        UserId: userId,
      },
    });

    const categoryIds = userCategories.map(
      (userCategory) => userCategory.CategoryId
    );

    const result = await Task.findAndCountAll({
      where: {
        [Op.or]: [
          {
            category: { [Op.in]: [categoryIds] },
          },
          {
            [Op.and]: [
              {
                category: { [Op.is]: null },
                owner: userId,
              },
            ],
          },
        ],
        id: taskId,
      },
    });

    return result.rows.length > 0 ? true : false;
  }
}

module.exports = TaskController;
