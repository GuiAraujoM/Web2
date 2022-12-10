const syncDb = require("./models/sync");

const express = require("express");
const app = express();

const session = require("express-session");

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: "ESTÁ SEGURO, CONFIA",
    resave: false,
    saveUninitialized: true
  })
);

const authRoutes = require("./routes/auth-routes");
app.use("/auth", authRoutes);

const taskRoutes = require("./routes/task-routes");
app.use("/tasks", taskRoutes);

const categoryRoutes = require("./routes/category-routes");
app.use("/categories", categoryRoutes);

app.get(`/`, async (req, res) => {  
  res.send('Ok');
});

app.listen(3000, () => {
  console.log("SERVER STARTED AT 3000");
});
