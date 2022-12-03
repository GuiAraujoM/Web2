const PostController = require("../controllers/PostController");
const controller = new PostController();

const isPostOwner = async (req, res, next) => {
  const { id } = req.params;

  if(!req.session.session_username) return res.redirect("/");

  let post = await controller.getById(id);

  if (req.session.session_username !== post.User.username){
    return res.redirect("/");
  }
  next();
};

module.exports = isPostOwner;
