var Car = require('../app/models/car');
var CarType = require('../app/models/carType');
var User = require('../app/models/user');
var Bill = require('../app/models/bill');
var Damage = require('../app/models/damage');
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
        Bill.find().populate('car').populate('user').populate('carType').where('user').equals(req.user.id).where('isFinished').equals(false).exec(function (err, bills) {
            if (err) {
                console.log(err);
            } else {
                Bill.find().populate('car').populate('user').populate('carType').where('user').equals(req.user.id).where('isFinished').equals(true).exec(function (err, billsHistory) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render('pages/myCurrentCar.ejs', {
                            user: req.user, // get the user out of session and pass to template
                            billsHistory: billsHistory, // get the billsHistory out of session and pass to template
                            bills:bills
                        });
                    }
                });
            }
        });
    });
	app.post('/pages/myCurrentCar', isLoggedIn, function (req, res) {
		Bill.find().populate('car').populate('user').populate('carType').where('user').equals(req.user.id).where('isFinished').equals(false).exec(function (err, bills) {
			if (err) {
				console.log(err);
			} else {
				Bill.find().populate('car').populate('user').populate('carType').where('user').equals(req.user.id).where('isFinished').equals(true).exec(function (err, billsHistory) {
					if (err) {
						console.log(err);
					} else {
						var damage = new Damage();
						damage.description = req.body.description;

						damage.amount = "0";
						damage.type = req.body.damageType;
						damage.bill = req.body.billno;
						damage.save(function (err, savedDamage) {
							if (err) {
								console.log("This is the initialization message: " + JSON.stringify(err));
								res.send("ERROR");
								return;
							} else {
								Bill.update({"damage":savedDamage._id}).where('_id').equals(req.body.billno).exec(function(err, updatedBill) {
									if (err) {
										console.log(err);
									} else {
										console.log("Done!");
									}
								});
							}
						});
						res.render('pages/myCurrentCar.ejs', {
							user: req.user, // get the user out of session and pass to template
							billsHistory: billsHistory, // get the billsHistory out of session and pass to template
							bills: bills
						});
					}
				});
			}
		});

	});
	app.post('/payBill', function (req, res) {
        var Bill = require('../app/models/bill')
        var billId = Number(req.body.billId)
        Bill.update({"isPayed":true}).where('_id').equals(billId).exec(function(err, bills) {
            if (err) {
                console.log(err);
            } else {
                var response = {'success': true, data: bills};
                res.send(response);
            }
        });
    });
    app.post('/pages/rentCarByModel', function (req, res) {
        var Car = require('../app/models/car')
        var type = Number(req.body.carType)
        Car.find().populate('carType').where('carType').equals(type).where('isAvailable').equals(true).exec(function(err, cars) {
            if (err) {
                console.log(err);
            } else {
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
        Car.find().distinct('locationName').where('isAvailable').equals(true).exec(function (err,locations) {
            if(err){
            } else {
                res.render('pages/rentCarByLocation.ejs', {
                    user: req.user, // get the user out of session and pass to template
                    locations: locations, // get the cars out of session and pass to template
                });
            }
        })
    });
    app.post('/getCarsByLocation', function (req, res) {
        var Car = require('../app/models/car')
        Car.find().populate('carType').where('locationName').equals(req.body.locationName).where('isAvailable').equals(true).exec(function(err, cars) {
            if (err) {
                console.log(err);
            } else {
                res.send(cars);
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
                var verificationLink = "http://" + req.headers.host + "/pages/verifyMe?vc=" + user.verificationCode;
                var mailOptions = emailTemplate.welcome_email(user.firstName, verificationLink);
                sendMail(mailOptions, user.email, function (err) {
                    console.log("Email sent");
                });
                res.json({success: "A confirmation mail has been sent to " + user.email});
            }
        });
    });
    app.get('/pages/addCar',isLoggedIn, function (req, res) {
        Car.find().populate('carType').exec(function (err, cars) {
            res.render('pages/addCar.ejs', {
                user: req.user, // get the user out of session and pass to template
                cars: cars
            });
        });
    });
    app.post('/pages/addCar',isLoggedIn, function (req, res) {
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
	app.get('/pages/carDamageReports', function (req, res) {
		var Bill = require('../app/models/bill')
		Bill.find().populate('damage').populate('user').populate('car').where('damage').ne(null).exec(function (err, bills) {
			res.render('pages/carDamageReports.ejs', {
				user: req.user, // get the user out of session and pass to template
				bills: bills,
			});
		});

	});
	app.post('/pages/carDamageReports', function (req, res) {
		var Damage = require('../app/models/damage')
		Damage.update({"amount": req.body.dmgAmount}).where('_id').equals(req.body.damageNo).exec(function (err, changedDamages) {
			if (err) {
				console.logx("Error occured while fetching damageID");
				res.send("ERROR IN find damageID");
			} else {
				Damage.find().populate('bill').populate('user').exec(function (err, damages) {
					res.render('pages/carDamageReports.ejs', {
						user: req.user, // get the user out of session and pass to template
						damages: damages,
					});
				});
			}
		});


	});
	app.post('/pages/deleteCars', function (req, res) {
        for (var i in req.body.ids) {
            Car.findByIdAndRemove(req.body.ids[i], function (err, car) {
                res.send("SUCCESS");
            });
        }
    });
    app.post('/isUserValid', function(req, res){
        if(req.isAuthenticated()){
            var response = {'success': true, data: ''};
            res.send(response);
        }else{
            var response = {'success': false, data: ''};
            res.send(response);
        }
    });
// book Car
    app.post('/pages/bookCar',isLoggedIn, function (req, res) {

        var bill = new Bill();
        bill.pickUpDate = req.body.pickUpDate;
        bill.dropOffDate = req.body.dropOffDate;
	    bill.pickUpTime = req.body.pickUpTime;
	    bill.dropOffTime = req.body.dropOffTime;
	    bill.distanceTravelled = req.body.distanceTravelled;
        bill.car = Number(req.body.carId);
        bill.user = Number(req.user._id);
        bill.damage = null;
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
	// dropoff Car
	app.post('/pages/dropOffCar', function (req, res) {

		// if user not logged in
		if (!req.user) {
			res.send("ERROR");
			return;
		}
		var data = req.body;

		Bill.findOne({_id: data.billId}).populate('damage').populate('car').where('car').equals(Number(data.carId)).exec(function(err, bill) {
			if (err) {
				console.log(JSON.stringify(err));
				res.send("ERROR");
				return;
			} else {
				bill.latitude = data.location.latitude;
				bill.longitude = data.location.longitude;
				bill.distanceTravelled = data.distanceTravelled;
				bill.isFinished = true;
				bill.amount = Number(bill.car.price) * Number(data.distanceTravelled);
				if ( bill.damage == null ) {
					bill.discount = ( bill.amount ) * 10/100;
				} else {
					bill.discount = 0;
				}

				bill.save(function (err, savedBill) {
					if (err) {
						console.log(JSON.stringify(err));
					}

					bill.car.isAvailable = true;
					bill.car.latitude = data.location.latitude;
					bill.car.longitude = data.location.longitude;
					bill.car.save(function (err, savedCar) {

					});

					res.send({data : bill});
				});
			}
		}); // end of bill findone
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
