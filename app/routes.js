
var Car = require('../app/models/car');
var CarType = require('../app/models/carType');
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
        });
    });
    //admin controller functions
    app.get('/admin', function (req, res) {
        res.render('admin.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });
    app.get('/pages/addCar', function (req, res) {
        Car.find().populate('carType').exec(function(err, cars) {
            res.render('pages/addCar.ejs', {
                user: req.user, // get the user out of session and pass to template
                cars: cars
            });
        });

    });
    app.post('/pages/addCar', function (req, res) {
        CarType.find().where('_id').equals(req.body.carType).exec(function(err, carType) {
            if (err) {
                console.logx("Error occured while fetching carType");
                res.send("ERROR IN find CarType");
            }else{
                var car = new Car();
                car.carPlateNo = req.body.carPlateNumber;
                car.carName = req.body.carName;
                car.carModel = req.body.carModel;
                car.price = req.body.carPrice;
                car.locationName = req.body.carLocation;
                car.latitude = req.body.carLatitude;
                car.longitude = req.body.carLongitude;
                car.isAvailable = true;
                car.carType = carType[0]._id;
                if(req.body.carAvailable === undefined){
                    car.isAvailable = false;
                }else{
                    car.isAvailable = true;
                }
                car.save(function (err, savedCar) {
                    if (err) {
                        console.log("This is the initialization message: " + JSON.stringify(err));
                        res.send("ERROR IN Car Save");
                    }else{
                        Car.findById(savedCar._id).populate('carType').exec(function(err, targetCar) {
                           if(err){
                               res.send("ERROR IN FindByID");
                           } else{
                               res.send(targetCar);
                           }
                        });

                    }
                });
            }
        });
    });
    app.post('/pages/deleteCars', function (req, res) {
        for (var i in req.body.ids) {
            // console.log("The id is: "+req.body.ids[i]);
            Car.findByIdAndRemove(req.body.ids[i], function (err, car) {
                res.send("SUCCESS");
            });
        }
    });
};