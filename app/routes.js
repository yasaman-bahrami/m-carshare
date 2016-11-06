// app/routes.js
module.exports = function (app, passport, mongoose) {
    app.get('/', function (req, res) {
        res.render('index.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });
    app.get('/index', function (req, res) {
        res.render('index.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    app.get('/pages/signUp', function (req, res) {
        res.render('pages/signUp.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });
    app.get('/pages/myCurrentCar', function (req, res) {
        res.render('pages/myCurrentCar.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });
    app.get('/pages/rentCarByLocation', function (req, res) {
        var Car = require('../app/models/car')
        Car.find().populate('carType').exec(function(err, cars) {
            if (err) {
                console.log(err);
            } else {
                res.render('pages/rentCarByLocation.ejs', {
                    user: req.user, // get the user out of session and pass to template
                    cars: cars // get the cars out of session and pass to template
                });
            }
            console.log("All cars: " + JSON.stringify(cars));
        });
    });
    app.get('/pages/rentCarByModel', function (req, res) {
        var Car = require('../app/models/car')
        Car.find().populate('carType').where('carType.type').equals(req.carType).exec(function(err, cars) {
            if (err) {
                console.log(err);
            } else {
                res.render('pages/rentCarByLocation.ejs', {
                    user: req.user, // get the user out of session and pass to template
                    cars: cars // get the cars out of session and pass to template
                });
            }
            console.log("All cars: " + JSON.stringify(cars));
        });
    });
    //admin controller functions
    app.get('/admin', function (req, res) {
        res.render('admin.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });
    app.get('/pages/addCar', function (req, res) {
        res.render('pages/addCar.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });
};