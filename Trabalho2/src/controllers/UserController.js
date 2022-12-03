const { User } = require("../models/User");
const { Op } = require("sequelize");

class UserController {
  constructor() {
    console.log("Iniciando o user controller");
  }

  async getByName(req, res) {
    console.log("UserController/get");
    const { username } = req.params;
    const user = await User.findOne({
      where: {
        username: username,
      },
    });

    return res.json(user);
  }
}


module.exports = UserController;