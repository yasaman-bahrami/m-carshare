/**
 * Created by Yasaman on 2016-11-18.
 */
// app/models/models.js
var mongoose = require('mongoose');
var user = require('./user');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
// define the schema for our bill model
var billSchema = mongoose.Schema({
    pickUpDate: String,
    dropOffDate: String,
    isFinished: {
        type: Boolean,
        default: false
    },
    distanceTravelled: String,
    amount: String,
    user : { type: mongoose.Schema.Types.Number, ref: 'user' },
    car : { type: mongoose.Schema.Types.Number, ref: 'car' },
    damage : { type: mongoose.Schema.Types.Number, ref: 'damage' }
});


// methods ======================
billSchema.methods.find = function(){
    mongoose.find({}, function(err, docs) {
        if (err) {console.log("error occured in find for bill!")}
        else{
            // object of all the users
            console.log(docs);
            return docs;
        }

    });
},
    billSchema.methods.findById = function(id){
        mongoose.findOne({_id: id}, function(err, bill) {
            if (err) {console.log("error occured in find for bill!")}
            else{
                // object of all the users
                console.log(bill);
                return bill;
            }

        });
    },
    billSchema.set('toJSON', {
        getters: true,
        virtuals: true
    });
// create the model for bills and expose it to our app
billSchema.plugin(autoIncrement.plugin, 'bill');
module.exports = mongoose.model('bill', billSchema);
