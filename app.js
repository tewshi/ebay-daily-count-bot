const createError = require('http-errors');
const express = require('express');
const scheduler = require('node-schedule');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sony = require('./modules/sony');
const microsoft = require('./modules/microsoft');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

sony.getDailySales().finally(
    microsoft.getDailySales
);
// run every 12:00 am -> 00:00 -> 0 0 * * *
scheduler.scheduleJob('0 0 * * *', function () {
    console.log('Running daily sales bot');
    sony.getDailySales().finally(
        microsoft.getDailySales
    )
});

module.exports = app;
