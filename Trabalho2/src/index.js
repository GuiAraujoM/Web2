const syncDb = require("./models/sync");

const express = require("express");
const app = express();

const session = require("express-session");
const isAuth = require("./middlewares/isAuth");

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: "ESTÁ SEGURO, CONFIA",
    resave: false,
    saveUninitialized: true
  })
);

const postRoutes = require("./routes/post-routes");
app.use("/posts", postRoutes);

const userRoutes = require("./routes/user-routes");
app.use("/users", userRoutes);

const commentRoutes = require("./routes/comment-routes");
app.use("/comments", commentRoutes);

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get(`/login`, isAuth, (req, res) => {
  res.render("login");
});

app.get(`/register`, isAuth, (req, res) => {
  res.render("register");
});

const AuthController = require("./controllers/AuthController");
const authController = new AuthController();

app.post(`/login`, isAuth, (req, res) => {
  authController.login(req, res);
});

app.post(`/register`, isAuth, (req, res) => {
  authController.register(req, res);
});

app.get(`/`, async (req, res) => {  
  let posts = await Post.findAll({
    order: [["created_at", "DESC"]],
    limit: 5,
    include: User
  });

  posts = posts.map((post) => {
    post.description = post.description.substring(0, 255);
    return post;
  });

  res.render("home", {
    posts: posts,
    nick: req.session.session_username,
    userid: req.session.session_userid,
  });
});

const { Post } = require("./models/Post");
const { User } = require("./models/User");

app.listen(3000, () => {
  console.log("SERVER STARTED AT 3000");
});
