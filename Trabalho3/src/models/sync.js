const { User } = require("./User");
const { Task } = require("./Task");
const { Category } = require("./Category");
const { CategoryUser } = require("./CategoryUser");

User.hasMany(Task, {
  foreignKey: "owner",
});
Task.belongsTo(User, {
  foreignKey: "owner",
});

User.hasMany(Category, {
  foreignKey: "owner",
});
Category.belongsTo(User, {
  foreignKey: "owner",
});

Category.hasMany(Task, {
  foreignKey: "category"
});
Task.belongsTo(Category, {
  foreignKey: "category"
});

User.belongsToMany(Category, { through: CategoryUser });
Category.belongsToMany(User, { through: CategoryUser });

const sequelize = require("../database/sequelize-connection");

console.log("Sync Models");
sequelize.sync();
