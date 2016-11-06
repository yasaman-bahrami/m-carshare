/*jslint node:true*/
/*eslint no-unused-params:0*/
/* These lines are hints to the code editor */

/**
 * Load the appropriate modules for our web application
 */
var express = require('express');
var http = require('http');
var path = require('path');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var configDB = require('./config/database.js');

// configuration ===============================================================
if (process && process.env && process.env.VCAP_SERVICES) {
    var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
    for (var svcName in vcapServices) {
        if (svcName.match(/^mongo.*/)) {
            mongoUrl = vcapServices[svcName][0].credentials.uri;
            mongoUrl = mongoUrl || vcapServices[svcName][0].credentials.url;
            console.log("This is mongoUrl: " + mongoUrl);
            mongoose.connect(mongoUrl);
        }
    }
} else {
    mongoose.connect(configDB.url); // connect to our database
}

//require('./config/passport')(passport); // pass passport for configuration

/**
 *** Initial setup
 **/
if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
}

var port = (process.env.VCAP_APP_PORT || 80);
var host = (process.env.VCAP_APP_HOST || '0.0.0.0');

/**
 * Setup the Express engine
 **/
var app = express();

app.configure(function () {
    app.set('port', port);
    app.set('view engine', 'ejs');

    app.use(morgan('dev'));
    app.use(express.static(path.join(__dirname, 'public')));
    // set up our express application
    app.use(express.logger('dev')); // log every request to the console
    app.use(express.cookieParser()); // read cookies (needed for auth)
    app.use(express.bodyParser()); // get information from html forms

    app.set('view engine', 'ejs'); // set up ejs for templating

    // required for passport
    app.use(express.session({secret: 'iloveprogramminginnodejsusingmongodb'})); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session

});
//we include our controller in here
require('./app/routes.js')(app, passport, mongoose);

/**
 * This is where the server is created and run.  Everything previous to this
 * was configuration for this server.
 **/
http.createServer(app).listen(app.get('port'), function () {
    //These are only for testing purposes, these should finally go into appropriate controllers inside routes.js
    // var User = require('./app/models/user');
    // var user = new User();
    //
    // user.email = "ybs572@mun.ca";
    // user.password = "123456";
    // user.address = "87a Portugal Cove Dr.";
    // user.phoneNo = "7093254625";
    // user.role = "user";
    // user.firstName = "Yasaman";
    // user.lastName = "Bahrami";
    // user.driverLicenseNo = "S8703300027";
    // user.save(function (err){
    //     if (err) {
    //         console.log("This is the initialization message: " + JSON.stringify(err));
    //     }
    // });
    var Car = require('./app/models/car');
    var CarType = require('./app/models/carType');
    var carType = new CarType();
    carType.type = "Standard";
    carType.save(function (err, savedCarType) {
        if (err) {
            console.log("This is the initialization message: " + JSON.stringify(err));
        } else {
            var car = new Car();
            car.carPlateNo = "1002232_" + carType._id;
            car.carName = "Ford";
            car.carModel = "Focus";
            car.price = "5";
            car.latitude = "36.5";
            car.longitude = "40.0";
            car.isAvailable = true;

            car.carType = carType._id;
            car.save(function (err, savedCar) {
                if (err) {
                    console.log("This is the initialization message: " + JSON.stringify(err));
                } else {
                    savedCarType.cars.push(savedCar._id);
                    savedCarType.update(function (err) {

                    });
                }
            });
        }

    });
    console.log('Express server listening on port ' + app.get('port'));
});



