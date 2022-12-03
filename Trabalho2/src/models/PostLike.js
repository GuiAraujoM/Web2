const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize-connection");

const PostLike = sequelize.define(
  "PostLike",
  {
    user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    post: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    }
  },
  {
    timestamps: false,
    tableName: "post_like",
  }
);

module.exports = { PostLike };
