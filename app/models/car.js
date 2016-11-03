/**
 * Created by Yasaman on 2016-11-03.
 */
// app/models/models.js
var mongoose = require('mongoose');
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
    isAvailable: Boolean,
    carTypes : [{ type: mongoose.Schema.Types.Number, ref: 'carType' }]
});


// methods ======================
carSchema.methods.find = function(){
    mongoose.find({}, function (err, docs) {
        JSON.stringify(docs);
        return docs;
//        res.json(docs);
    })
},
carSchema.set('toJSON', {
    getters: true,
    virtuals: true
});
// create the model for cars and expose it to our app
carSchema.plugin(autoIncrement.plugin, 'car');
module.exports = mongoose.model('car', carSchema);
