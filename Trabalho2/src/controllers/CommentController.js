const { Comment } = require("../models/Comment");
const { Op } = require("sequelize");

class CommentController {
  constructor() {
    console.log("Iniciando o Comment controller");
  }

  async createComment(req, res) {
    console.log("CommentController/create");
    const { content, related_post } = req.body;

    const now = new Date(Date.now());
    let created_at = `${now.getFullYear()}-${now.getMonth()}-${now.getDay()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    await Comment.create({
      content: content,
      related_post: related_post,
      comment_author: req.session.session_userid,
      updated_at: created_at,
      created_at: created_at,
    }).then((created) => {
      return res.redirect(`../posts/${related_post}`);
    });
  }

  async hideComment(req, res) {
    const { id } = req.params;

    let comment = await this.getById(id);;
    let hidden;

    if(comment.hidden == 'true') hidden = 'false';
    else hidden = 'true';

    await Comment.update(
      {
        hidden: hidden,
      },
      {
        where: {
          id: id,
        },
      }
    );

    res.redirect(`/posts/${comment.related_post}`);
  }

  async getById(id){
    console.log("CommentController/getPostByCommentId");
    const comment = await Comment.findOne({
      where: {
        id: id,
      },
    });

    return comment;
  }
}

module.exports = CommentController;
