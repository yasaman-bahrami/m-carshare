/**
 * Created by Yasaman on 2016-11-03.
 */
// app/models/models.js
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

// define the schema for our user model
var userSchema = mongoose.Schema({
    email: {type : String , unique : true, required : true, dropDups: true },
    password: String,
    address: String,
    phoneNo: String,
    role: {
        type: String,
        default: "client"
    },
    firstName: String,
    lastName: String,
    driverLicenseNo: String,
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: String
});

// methods ======================
// generating a hash

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};
userSchema.methods.find = function(){
    mongoose.find({}, function (err, docs) {
        JSON.stringify(docs);
        return docs;
//        res.json(docs);
    })
};
userSchema.methods.findOne = function(email){
    mongoose.findOne({'email' :  email}, function (err, docs) {
        JSON.stringify(docs);
        return docs;
//        res.json(docs);
    })
};
userSchema.set('toJSON', {
    getters: true,
    virtuals: true
});
// create the model for users and expose it to our app
userSchema.plugin(autoIncrement.plugin, 'user');
module.exports = mongoose.model('user', userSchema);
