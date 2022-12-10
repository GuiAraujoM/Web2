const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize-connection");

const CategoryUser = sequelize.define(
  "CategoryUser", {},
  {
    timestamps: false,
    tableName: "category_user",
  }
);

module.exports = { CategoryUser };
