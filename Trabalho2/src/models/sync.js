const { Post } = require("./Post");
const { PostLike } = require("./PostLike");
const { User } = require("./User");
const { Comment } = require("./Comment");
const { CommentLike} = require("./CommentLike");


User.hasMany(Post, {
  foreignKey: "post_author",
});
Post.belongsTo(User, {
  foreignKey: "post_author",
});

User.hasMany(PostLike, {
  foreignKey: "user",
  onDelete: 'CASCADE'
});
PostLike.belongsTo(User, {
  foreignKey: "user",
  onDelete: 'CASCADE'
});

Post.hasMany(PostLike, {
  foreignKey: "post",
  onDelete: "CASCADE",
});
PostLike.belongsTo(Post, {
  foreignKey: "post",
  onDelete: "CASCADE",
}); 

Post.hasMany(Comment, {
  foreignKey: "related_post",
});
Comment.belongsTo(Post, {
  foreignKey: "related_post",
});

User.hasMany(CommentLike, {
  foreignKey: "user",
  onDelete: "CASCADE",
});
CommentLike.belongsTo(User, {
  foreignKey: "user",
  onDelete: "CASCADE",
});

User.hasMany(Comment, {
  foreignKey: "comment_author",
});
Comment.belongsTo(User, {
  foreignKey: "comment_author",
}); 

Comment.hasMany(CommentLike, {
  foreignKey: "comment",
  onDelete: "CASCADE",
});
CommentLike.belongsTo(Comment, {
  foreignKey: "comment",
  onDelete: "CASCADE",
}); 

const sequelize = require("../database/sequelize-connection");

console.log("Sync Models");
sequelize.sync();
