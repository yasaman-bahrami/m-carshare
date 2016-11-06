
// Email verification
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var User = require('./models/user');
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
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log('Error occurred while sending email to ', email, '. Detailed Err: ', error);
            callback(error);
        }
        else{
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

    //Route to receive signup form data
    app.get('/pages/verifyMe', function(req, res){
        if(req.query==undefined || req.query.vc==undefined || req.query.vc==null) {
            return res.render('pages/verificationStatus.ejs', {});
        }

        var verificationCode = req.query.vc;

        User.findOne({verificationCode: verificationCode}, function(err, user){
            if(err) {
                console.log('ERROR occurred while fetching user corressponding to given verificationCode: ', verificationCode);
                return res.render('pages/verificationStatus.ejs', {
                    message: "Verification link is invalid."
                });
            }
            else if(user) {
                console.log('User found=> ', user);
                if(user.isEmailVerified){
                    return res.render('pages/verificationStatus.ejs', {
                        message: "Your email address is already verified"
                    });
                }
                else {
                    user.isEmailVerified = true;
                    user.save(function(err){
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

    app.post('/pages/register', function(req, res){
        var user = new User(req.body);
        user.verificationCode = crypto.createHash('sha1').update(user.email).digest('hex');
        console.log(user);
        user.save(function(err) {
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
            else{
                var verificationLink = "http://localhost/pages/verifyMe?vc=" + user.verificationCode;
                var mailOptions = emailTemplate.welcome_email(user.firstName, verificationLink);
                sendMail(mailOptions, user.email, function(err) {
                    console.log("Email sent");
                });
                res.json({success: "A confirmation mail has been sent to " + user.email});
            }
        });
    });
};