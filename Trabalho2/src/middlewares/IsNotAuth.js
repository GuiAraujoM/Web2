const isNotAuth = (req, res, next) => {
  console.log("Verificando se usuário está autenticado");
  if (!req.session.session_username) {
    return res.redirect("/");
  }
  next();
};

module.exports = isNotAuth;
