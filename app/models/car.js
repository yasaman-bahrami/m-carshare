/**
 * Created by Yasaman on 2016-11-03.
 */
// app/models/models.js
var mongoose = require('mongoose');
var carType = require('./carType');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
// define the schema for our car model
var carSchema = mongoose.Schema({
    carPlateNo: {type : String , unique : true, required : true, dropDups: true },
    carName: String,
    carModel: String,
    price: String,
    latitude: String,
    longitude: String,
    locationName: String,
    isAvailable: Boolean,
    carType : { type: mongoose.Schema.Types.Number, ref: 'carType' },
    bills : [{ type: mongoose.Schema.Types.Number, ref: 'bill' }]
});


// methods ======================
carSchema.methods.find = function(){
    mongoose.find({}, function(err, docs) {
        if (err) {console.log("error occured in find for car!")}
        else{
            // object of all the users
            console.log(docs);
            return docs;
        }

    });
},
carSchema.methods.findById = function(id){
    mongoose.findOne({_id: id}, function(err, car) {
        if (err) {console.log("error occured in find for car!")}
        else{
            // object of all the users
            console.log(car);
            return car;
        }

    });
},
carSchema.set('toJSON', {
    getters: true,
    virtuals: true
});
// create the model for cars and expose it to our app
carSchema.plugin(autoIncrement.plugin, 'car');
module.exports = mongoose.model('car', carSchema);
