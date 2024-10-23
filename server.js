const express = require('express')
const path = require('path')
const ejs = require('ejs')
const { connectDB } = require('./config/db.js');

// main Router 
const homeRouter = require('./routes/app.route.js');

const PORT = process.env.PORT || 5000;
const app = express();

app.set('view engine', 'ejs');

// Middlewares  
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// to make public folder accesable
app.use(express.static(path.join(__dirname, 'public')));


// starting the Database connection
connectDB();

//setting the main router
app.use('/', homeRouter)


// Error trigger middleware for testing
// app.use((req, res, next) => {
//     var test = new Error("THIS IS TESTING ERROR");

//     next(test);
// })

// Starting the server


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})