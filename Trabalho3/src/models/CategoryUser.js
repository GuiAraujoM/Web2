const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize-connection");

const CategoryUser = sequelize.define(
  "CategoryUser",
  {
    category: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
    tableName: "category_user",
  }
);

module.exports = { CategoryUser };
