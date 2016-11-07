//Verification email template

module.exports.welcome_email = function(firstName, verificationLink) {
    var mailOptions = {};
    mailOptions.html = [
        'Hello ' + firstName + ','+ '<br/><br/>' ,
        'We are delighted to welcome you to M-CAR Share Company!',
        'In order to confirm your account. Please click on the link below: '+ '<br/><br/>',
        verificationLink + '<br/><br/>',
        'Thanks'
    ].join('\n\n');
    mailOptions.subject = 'Welcome to M-CAR Share Company!';
    return mailOptions;
}