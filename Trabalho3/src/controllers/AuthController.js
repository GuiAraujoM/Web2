const { User } = require("../models/User");
const { Op, Sequelize } = require("sequelize");
const validateUserDto = require("../validators/UserValidator");
const UserController = require("./UserController");
const userController = new UserController();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config({ path: `${__dirname}/../.env` });


class AuthController {
  constructor() {
    console.log("Iniciando o Auth controller");
  }

  async login(req, res) {
    console.log("AuthController/login");
    const { email, password } = req.body;

    if(!email || !password){
      res.status(400).send({success: false, message: 'Campos obrigatórios não preenchidos'})
    }
    
    const user = await User.findOne({
      where: {
        email: email,
        password: password
      }      
    });

    if (user) {

      const token = jwt.sign(
        {
          email: email,
          password: password,
        },
        process.env.SECRET,
        {
          expiresIn: "300s"
        }
      );

      console.log("Token gerado, logando como: " + email);
      return res.status(200).json({success: true, token: token});
    }else{
      return res.status(403).json({success: false, message: 'Erro, e-mail ou senha incorretos.'});
    }
  }

  async register(req, res) {
    console.log("AuthController/register");

    const { name, email, password } = req.body;

    const userDto = {
      name,
      email,
      password
    };

    const error = validateUserDto(userDto);

    if (error) {
      return res.status(400).json({created: false, ...error});
    }

    const user = await userController.getByEmail(email);
    if(user){
      return res.status(400).json({created: false, message: 'E-mail já cadastrado'});
    }

    const created = await userController.create(userDto);

    if(created){
      res.status(201).send({ created: true });
    }else{
      res.status(500).send({ created: false, message: 'Error' });
    }
  }
}

module.exports = AuthController;
