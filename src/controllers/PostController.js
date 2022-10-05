const db = require('../database/dbconnection');

class PostController {
  constructor() {
    console.log("Iniciando o post controller");
  }

  detail(req, res) {
    console.log('controller/detail');
    const { id } = req.params;
    db.get(`SELECT * FROM post WHERE id = ?`, [id], (err, post) => {
      if (err) {
        console.error(err);
      } else {
        res.render("detail", { post: post });
      }
    });
  }

  create(req, res) {
    console.log("controller/create");
    const { title, description, images, author, thumb } = req.body;
    const now = new Date(Date.now());
    let created_at = `${now.getFullYear()}-${now.getMonth()}-${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    const sql =
      "INSERT INTO post (title, description, images, author, thumb, created_at) VALUES (?, ?, ?, ?, ?, ?) RETURNING id";
    const params = [title, description, images, author, thumb, created_at];
    db.run(sql, params, function(err) {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.redirect(`/posts/${this.lastID}`);
    });
  }

  delete(req, res) {
    console.log("controller/delete");
    const { id } = req.params;
    const sql = "DELETE FROM post WHERE id = ?";
    db.run(sql, [id], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("ERRO AO EXCLUIR");
      }
      return res.redirect("/posts");
    });
  }

  loadEdit(req, res) {
    console.log("controller/loadEdit");
    const { id } = req.params;
    db.get(`SELECT * FROM post WHERE id = ?`, [id], (err, post) => {
      if (err) {
        console.log(err);
        return res.status(500).send("ERRO AO EDITAR");
      }
      res.render("edit", { post: post });
    });
  }

  edit(req, res) {
    console.log("controller/edit");
    const { description, title, author, images } = req.body;
    const id = req.params.id;
    const sql =
      "UPDATE post SET author = ?, title = ?, description = ?, images = ? WHERE id = ?";
    db.run(sql, [author, title, description, images, id], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("ERRO AO EDITAR");
      }
      return res.redirect(`/posts/${id}`);
    });
  }

  listRecent(req, res) {
    console.log("controller/listRecent");
    let posts;
    db.all(
      `SELECT * FROM post ORDER BY created_at DESC LIMIT 5`,
      (err, rows) => {
        if (err) {
          console.error(err);
        } else {
          rows = rows.map(post => {
            post.description = post.description.substring(0, 255);
            return post;
          })
          res.render("home", { posts: rows });
        }
      }
    );
  }

  listAll(req, res) {
    console.log("controller/listAll");
    var searchParam = '';
    if(req.query.search) {
      searchParam = `WHERE title like '%${req.query.search}%' OR description like '%${req.query.search}%' `;
    }
    db.all(`SELECT * FROM post ${searchParam}ORDER BY created_at DESC`, (err, rows) => {
      if (err) {
        console.error(err);
      } else {
        if (this.paginatePosts(rows, req.params.page)) {
          res.render("posts", {
            data: this.paginatePosts(rows, req.params.page),
          });
        } else {
          res.redirect("./1");
        }
      }
    });
  }

  paginatePosts(rows, currentPage) {
    let obj = {};
    obj.currentPage = currentPage;
    obj.pages = Math.ceil(rows.length / 5);

    if (currentPage > obj.pages || currentPage < 1) return null;

    if (currentPage == 1 || !currentPage) {
      obj.posts = rows.slice(0, 5);
      obj.posts = obj.posts.map(post => {
        post.description = post.description.substring(0, 255);
        return post
      })
      
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