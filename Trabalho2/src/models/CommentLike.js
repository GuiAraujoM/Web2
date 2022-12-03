const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize-connection");

const CommentLike = sequelize.define(
  "CommentLike",
  {
    user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    comment: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    }
  },
  {
    timestamps: false,
    tableName: "comment_like",
  }
);

module.exports = { CommentLike };
