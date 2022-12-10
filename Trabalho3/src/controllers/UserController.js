const { User } = require("../models/User");
const { Op } = require("sequelize");

class UserController {
  constructor() {
    console.log("Iniciando o user controller");
  }

  async getByEmail(email) {
    console.log("UserController.getByEmail()");
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    return user;
  }

  async getById(id) {
    console.log("UserController.getById()");
    const user = await User.findOne({
      where: {
        id: id,
      },
    });

    return user;
  }

  async create(user) {
    console.log("UserController.create()");
    const now = new Date(Date.now());
    const date_now = `${now.getFullYear()}-${now.getMonth()}-${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    const createdUser = await User.create({
      name: user.name,
      email: user.email,
      password: user.password,
      updated_at: date_now,
      created_at: date_now,
    });

    return createdUser;
  }
}


module.exports = UserController;