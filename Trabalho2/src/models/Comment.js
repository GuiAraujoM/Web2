const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize-connection");

const Comment = sequelize.define(
  "Comment",
  {
    content: DataTypes.STRING,
    hidden: DataTypes.STRING,
    comment_author: DataTypes.INTEGER,
    related_post: DataTypes.INTEGER,
    created_at: DataTypes.STRING,
    updated_at: DataTypes.STRING,
  },
  {
    timestamps: false,
    tableName: "comment",
  }
);

module.exports = { Comment };
