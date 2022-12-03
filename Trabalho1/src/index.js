const express = require('express');
const app = express();

//configura ejs
app.set('view engine', 'ejs');

//aponta para as views
app.set('views', 'src/views');  

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());


const PostController = require("./controllers/PostController");
const controller = new PostController();

const postRoutes = require('./routes/post-routes');
app.use('/posts', postRoutes);

app.get('/', (req, res) => {    
    console.log('rota /');
    controller.listRecent(req, res);
});

app.listen(3000, () => {
    console.log("SERVER STARTED AT 3000");
});