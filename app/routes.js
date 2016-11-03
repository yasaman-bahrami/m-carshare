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
    app.get('/admin', function (req, res) {
        res.render('admin.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });
    app.get('/pages/rentCarByModel', function (req, res) {
        res.render('pages/rentCarByModel.ejs', {
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
        res.render('pages/rentCarByLocation.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });
};