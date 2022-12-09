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

Category.hasMany(CategoryUser, {
  foreignKey: "category",
  onDelete: "CASCADE",
});
CategoryUser.belongsTo(Category, {
  foreignKey: "category",
  onDelete: "CASCADE",
}); 

User.hasMany(CategoryUser, {
  foreignKey: "user",
  onDelete: "CASCADE",
});
CategoryUser.belongsTo(User, {
  foreignKey: "user",
  onDelete: "CASCADE",
});

const sequelize = require("../database/sequelize-connection");

console.log("Sync Models");
sequelize.sync();
