var Car = require('../app/models/car');
var CarType = require('../app/models/carType');
var User = require('../app/models/user');
var Bill = require('../app/models/bill');
// Email verification
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var emailTemplate = require('./emailTemplate');

function sendMail(mailOptions, email, callback) {
    mailOptions.from = 'mcarshare@gmail.com';
    mailOptions.to = email;
    var smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "mcarshare@gmail.com",
            pass: "mcar2016"
        }
    });
    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log('Error occurred while sending email to ', email, '. Detailed Err: ', error);
            callback(error);
        }
        else {
            console.log('Message sent successfully to ', email);
            callback(null, response.message);
        }
    });
}

// app/routes.js
module.exports = function (app, passport, mongoose) {
    app.get('/', function (req, res) {
        console.log("This is the user:");
        console.log(req.user);
        console.log("DONE**********");
        res.render('index.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });
    app.get('/login', function (req, res) {
        res.render('login.ejs', {
            user: req.user, // get the user out of session and pass to template
            message: req.flash('loginMessage')
        });
    });
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/index');
    });
    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/index', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // =====================================
    // PROFILE SECTION =========================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/index', isLoggedIn, function(req, res) {
        console.log(req.user.role+"!!!!!!!!");
        if(req.user.role=='admin'){
            res.redirect('/pages/addCar');

        }else if(req.user.role=='client'){
            res.render('index.ejs', {
                user : req.user // get the user out of session and pass to template
            });

        }
    });

    app.get('/pages/signUp', function (req, res) {
        res.render('pages/signUp.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });
    app.get('/pages/myCurrentCar', isLoggedIn, function (req, res) {
        res.render('pages/myCurrentCar.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });
    app.post('/pages/rentCarByModel', function (req, res) {
        var Car = require('../app/models/car')
        var type = Number(req.body.carType)
        Car.find().populate('carType').where('carType').equals(type).exec(function(err, cars) {
            if (err) {
                console.log(err);
            } else {
                // res.render('pages/rentCarByModel.ejs', {
                //     user: req.user, // get the user out of session and pass to template
                //     cars: cars // get the cars out of session and pass to template
                // });
                var response = {'success': true, data: cars};
                res.send(response);
            }
        });
    });
    app.get('/pages/rentCarByModel', function (req, res) {
        res.render('pages/rentCarByModel.ejs', {
            user: req.user, // get the user out of session and pass to template
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

    //Route to receive signup form data
    app.get('/pages/verifyMe', function (req, res) {
        if (req.query == undefined || req.query.vc == undefined || req.query.vc == null) {
            return res.render('pages/verificationStatus.ejs', {});
        }

        var verificationCode = req.query.vc;

        User.findOne({verificationCode: verificationCode}, function (err, user) {
            if (err) {
                console.log('ERROR occurred while fetching user corressponding to given verificationCode: ', verificationCode);
                return res.render('pages/verificationStatus.ejs', {
                    message: "Verification link is invalid."
                });
            }
            else if (user) {
                console.log('User found=> ', user);
                if (user.isEmailVerified) {
                    return res.render('pages/verificationStatus.ejs', {
                        message: "Your email address is already verified"
                    });
                }
                else {
                    user.isEmailVerified = true;
                    user.save(function (err) {
                        console.log("User email address verified now.");
                    });
                    return res.render('pages/verificationStatus.ejs', {
                        message: "Your email address is verified now"
                    });
                }
            }
            else {
                console.log('User not found=> ', user);
                return res.render('pages/verificationStatus.ejs', {
                    message: "Verification link is invalid."
                });
            }
        });
    });

    app.post('/pages/register', function (req, res) {
        var user = new User(req.body);
        user.verificationCode = crypto.createHash('sha1').update(user.email).digest('hex');
        user.password = user.generateHash(req.body.password)
        user.save(function (err) {
            if (err) {
                switch (err.code) {
                    case 11000:
                    case 11001:
                        res.json({
                            error: {email: "Email already exists"}
                        });
                        break;
                    default:
                        var modelErrors = [];

                        if (err.errors) {

                            for (var x in err.errors) {
                                modelErrors.push({
                                    param: x,
                                    msg: err.errors[x].message,
                                    value: err.errors[x].value
                                });
                            }
                            res.json(modelErrors);
                        }
                }
            }
            else {
                var verificationLink = "http://" + req.headers.host + ":" + app.get('port') + "/pages/verifyMe?vc=" + user.verificationCode;
                var mailOptions = emailTemplate.welcome_email(user.firstName, verificationLink);
                sendMail(mailOptions, user.email, function (err) {
                    console.log("Email sent");
                });
                res.json({success: "A confirmation mail has been sent to " + user.email});
            }
        });
    });
    app.get('/pages/addCar', function (req, res) {
        Car.find().populate('carType').exec(function (err, cars) {
            res.render('pages/addCar.ejs', {
                user: req.user, // get the user out of session and pass to template
                cars: cars
            });
        });

    });
    app.post('/pages/addCar', function (req, res) {
        CarType.find().where('_id').equals(req.body.carType).exec(function (err, carType) {
            if (err) {
                console.logx("Error occured while fetching carType");
                res.send("ERROR IN find CarType");
            } else {
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
                if (req.body.carAvailable === undefined) {
                    car.isAvailable = false;
                } else {
                    car.isAvailable = true;
                }
                car.save(function (err, savedCar) {
                    if (err) {
                        console.log("This is the initialization message: " + JSON.stringify(err));
                        res.send("ERROR IN Car Save");
                    } else {
                        Car.findById(savedCar._id).populate('carType').exec(function (err, targetCar) {
                            if (err) {
                                res.send("ERROR IN FindByID");
                            } else {
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
// book Car
    app.post('/pages/bookCar', function (req, res) {

        var bill = new Bill();
        bill.pickUpDate = req.body.pickUpDate;
        bill.dropOffDate = req.body.dropOffDate;
        bill.distanceTravelled = req.body.distanceTravelled;
        bill.car = Number(req.body.carId);
        bill.user = Number(req.user._id);
        console.log(bill._id);
        bill.save(function (err, savedBill) {
            if (err) {
                console.log("This is the initialization message: " + JSON.stringify(err));
                res.send("ERROR");
                return;
            } else {
                User.findOne({_id: req.user._id}, function (err, user) {
                    if (err) {
                        console.log("User not found");
                    } else {
                        user.bills.push(bill._id);
                        user.save(function (err, savedUser) {
                        });
                    }
                });
                Car.findOne({_id: req.body.carId}, function (err, car) {
                    if (err) {
                        console.log("Car not found");
                    } else {
                        car.isAvailable = false;
                        car.bills.push(bill._id);
                        car.save(function (err, savedCar) {
                        });
                    }

                });
                res.send("SUCCESS");
            }
        });

    });
};
// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}
