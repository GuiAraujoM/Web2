const { User } = require("../models/User");
const { Op, Sequelize } = require("sequelize");

class AuthController {
  constructor() {
    console.log("Iniciando o Auth controller");
  }

  async login(req, res) {
    console.log("AuthController/login");
    const { username, password } = req.body;
    
    const user = await User.findOne({
      where:{
        username: username,
        password: password
      }      
    });

    if (user) {      
      req.session.session_username = user.username;
      req.session.session_userid = user.id;
      console.log("Logando como: " + user.username);
      return res.redirect("/posts");
    }else{
      return res.render('./login', {success: false});
    }
  }

  async register(req, res) {
    console.log("AuthController/register");

    const { username, email, password } = req.body;

    const now = new Date(Date.now());
    let created_at = `${now.getFullYear()}-${now.getMonth()}-${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    await User.create({
      username: username,
      email: email,
      password: password,
      updated_at: created_at,
      created_at: created_at,
    }).then((created) => {
      if(created){        
        return res.redirect(`/login`);
      }else{
        return res.redirect(`/register`);
      }
    });    
  }
}

module.exports = AuthController;
