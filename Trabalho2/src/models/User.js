const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize-connection");

const User = sequelize.define(
  "User",
  {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    created_at: DataTypes.STRING,
    updated_at: DataTypes.STRING,
  },
  {
    timestamps: false,
    tableName: "user",
  }
);

module.exports = { User };
