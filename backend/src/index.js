const express = require('express');
const morgan = require('morgan');
const path = require('path');
const createError = require('http-errors');
const cors = require("cors");
require('dotenv').config();
const session = require('express-session');

const app = express();
const port = process.env.PORT || 8080;

const db = require('./config/db');
db.connect();
const route = require('./routes');
require('./config/passport');

// HTTP logger
app.use(morgan('dev'));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// log req body
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use(cors());

app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: +process.env.SESSION_COOKIE_MAXAGE
    },
    resave: false,
    saveUninitialized: false
}));

// Routes init 
route(app);

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError.NotFound('This route does not exist'));
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        }
    })
})

app.listen(port, () => {
    console.log(`App listening on ${port}`);
})