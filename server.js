const express = require('express')
const path = require('path')
const ejs = require('ejs')
const bodyParser = require('body-parser');
const cors = require('cors')
const { connectDB } = require('./config/db.js');

// main Router 
const homeRouter = require('./routes/app.route.js');

const PORT = process.env.PORT || 5000;
const app = express();

app.set('view engine', 'ejs');

// Middlewares  
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(require('express-status-monitor')());

// REMOVE IT AFTER TESTING
// to make public folder accesable
app.use(express.static(path.join(__dirname, 'public')));


// starting the Database connection
connectDB();

//setting the main router
app.use('/', homeRouter)


//Error trigger middleware for testing
app.use(function (error, req, res, next) {

    res.status(500).json({
        success: false,
        message: error.message
    })
    next(test);
})

// Starting the server


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})