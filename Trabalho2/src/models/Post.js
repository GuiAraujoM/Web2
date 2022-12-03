const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize-connection");

const Post = sequelize.define(
  "Post",
  {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    thumb: DataTypes.STRING,
    images: DataTypes.STRING,
    created_at: DataTypes.STRING,
    updated_at: DataTypes.STRING,
  },
  {
    timestamps: false,
    tableName: "post"
  }
);

module.exports = { Post };
