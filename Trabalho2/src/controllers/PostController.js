const { Post } = require("../models/Post");
const { PostLike } = require("../models/PostLike");
const { User } = require("../models/User");
const { Comment } = require("../models/Comment");
const { Op, Sequelize } = require("sequelize");

class PostController {
  constructor() {
    console.log("Iniciando o post controller");
  }

  async getById(id) {
    console.log("PostController/getById");

    const post = await Post.findOne({
      where: {
        id: id,
      },
      include: User,
    });

    return post;
  }

  async detail(req, res) {
    console.log("PostController/detail");
    const { id } = req.params;

    const post = await Post.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: User,
        },
        {
          model: PostLike,
        },
        {
          model: Comment,
          include: [{ model: User }],
        },
      ],
      order: [[Comment, "created_at", "DESC"]],
    });

    res.render("detail", {
      post: post,
      nick: req.session.session_username,
      userid: req.session.session_userid,
    });
  }

  async create(req, res) {
    console.log("PostController/create");
    const { title, description, images, author, thumb } = req.body;

    let authorId = author.substring(
      author.indexOf(":") + 1,
      author.indexOf(";")
    );

    const now = new Date(Date.now());
    let created_at = `${now.getFullYear()}-${now.getMonth()}-${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    let imgs = "";
    if (images) {
      imgs = images.toString().replace(",htt", ";htt");
    }

    await Post.create({
      description: description,
      title: title,
      post_author: authorId,
      thumb: thumb,
      images: imgs,
      updated_at: created_at,
      created_at: created_at,
    }).then((created) => {
      return res.redirect(`/posts/${created.id}`);
    });
  }

  async delete(req, res) {
    console.log("PostController/delete");
    const { id } = req.params;

    await Post.destroy({
      where: {
        id: id,
      },
    });

    return res.redirect("/posts");
  }

  async like(req, res) {
    console.log("PostController/like");

    if (!req.session.session_userid) return res.json({ success: false });

    const { id } = req.params;

    const like = await PostLike.findOne({
      where: {
        user: req.session.session_userid,
        post: id,
      },
    });

    if(like){
      console.log('Encontrou like')
      await PostLike.destroy({
        where: { 
          user: req.session.session_userid, 
          post: id 
        },
      });
      return res.json({success: true, active: false})
    }

    await PostLike.create({
      user: req.session.session_userid,
      post: id,
    }).then((created) => {
      return res.json({ success: true, active: true });
    });    
  }

  async loadEdit(req, res) {
    console.log("PostController/loadEdit");
    const { id } = req.params;
    const post = await Post.findOne({
      where: {
        id: id,
      },
      include: User,
    });

    res.render("edit", { post: post });
  }

  async edit(req, res) {
    console.log("PostController/edit");
    const { description, title, author, thumb, images } = req.body;
    const id = req.params.id;

    let authorId = author.substring(
      author.indexOf(":") + 1,
      author.indexOf(";")
    );

    let imgs = "";
    if (images) {
      imgs = images.toString().replace(",htt", ";htt");
    }

    const now = new Date(Date.now());
    let updated_at = `${now.getFullYear()}-${now.getMonth()}-${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    await Post.update(
      {
        description: description,
        title: title,
        post_author: authorId,
        thumb: thumb,
        images: imgs,
        updated_at: updated_at,
      },
      {
        where: {
          id: id,
        },
      }
    );

    return res.redirect(`/posts/${id}`);
  }

  async listAll(req, res) {
    console.log("PostController/listAll");

    let where;
    if (req.query.search) {
      where = {
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${req.query.search}%`,
            },
          },
          {
            description: {
              [Op.like]: `%${req.query.search}%`,
            },
          },
        ],
      };
    }

    let { orderby } = req.query;
    console.log("ordena porrr: " + orderby);
    if (orderby !== "likes") {
      orderby = "created_at";
    }

    let rows = await Post.findAll({
      where: where,
      order: [[orderby, "DESC"]],
      include: [
        {
          model: User,
        },
        {
          model: PostLike,
        },
        {
          model: Comment,
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.literal(`(
                SELECT COUNT(*)
                FROM post_like
                WHERE
                post_like.post = post.id
            )`),
            "likes",
          ],
        ],
      },
    });

    if (this.paginatePosts(rows, req.params.page)) {
      let posts = this.paginatePosts(rows, req.params.page);
      res.render("posts", {
        data: posts,
        nick: req.session.session_username,
        userid: req.session.session_userid,
      });
    } else {
      res.redirect("./1");
    }
  }

  async listAllByUsername(req, res) {
    console.log("PostController/listAllByUsername");

    const { username } = req.params;
    const user = await User.findOne({
      where: {
        username: username,
      },
    });

    if(!user) res.send('Usuário não encontrado');

    let { orderby } = req.query;
    console.log('ordena porrr: ' + orderby)
    if(orderby !== 'likes'){
      orderby = 'created_at'
    }

    let rows = await Post.findAll({
      where: {
        post_author: user.id,
      },
      order: [[orderby, "DESC"]],
      include: [
        {
          model: User,
        },
        {
          model: PostLike,
        },
        {
          model: Comment,
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.literal(`(
                SELECT COUNT(*)
                FROM post_like
                WHERE
                post_like.post = post.id
            )`),
            "likes",
          ],
        ],
      }
    });

    if (this.paginatePosts(rows, req.params.page)) {
      let posts = this.paginatePosts(rows, req.params.page);
      res.render("posts", {
        data: posts,
        nick: req.session.session_username,
        userid: req.session.session_userid,
      });
    } else {
      res.redirect("./1");
    }
  }

  paginatePosts(rows, currentPage) {
    let obj = {};
    obj.currentPage = currentPage;
    obj.pages = Math.ceil(rows.length / 5);

    if (currentPage > obj.pages || currentPage < 1) return null;

    if (currentPage == 1 || !currentPage) {
      obj.posts = rows.slice(0, 5);
      obj.posts = obj.posts.map((post) => {
        post.description = post.description.substring(0, 255);
        return post;
      });

      return obj;
    }

    const startIndex = Math.pow(5, currentPage - 1);
    const endIndex = startIndex + 5;
    obj.posts = rows.slice(startIndex, endIndex);
    obj.posts = obj.posts.map((post) => {
      post.description = post.description.substring(0, 255);
      return post;
    });

    return obj;
  }
}

module.exports = PostController;
