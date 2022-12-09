const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize-connection");

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    due_date: {
      type: DataTypes.STRING,
    },
    done: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "false",
    },
    completed_at: {
      type: DataTypes.STRING,
    },
    created_at: DataTypes.STRING,
    updated_at: DataTypes.STRING,
  },
  {
    timestamps: false,
    tableName: "task",
  }
);

module.exports = { Task };
