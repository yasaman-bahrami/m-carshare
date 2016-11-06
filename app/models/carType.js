/**
 * Created by Yasaman on 2016-11-03.
 */
// app/models/models.js
var mongoose = require('mongoose');
var Car = require('./car');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

// define the schema for our carType model
var carTypeSchema = mongoose.Schema({
    type: String,
    cars : [{ type: mongoose.Schema.Types.Number, ref: 'car' }]
});


// methods ======================
carTypeSchema.methods.find = function(){
    mongoose.find({}, function (err, docs) {
        JSON.stringify(docs);
        return docs;
//        res.json(docs);
    })
},
carTypeSchema.set('toJSON', {
    getters: true,
    virtuals: true
});
// create the model for carTypes and expose it to our app
carTypeSchema.plugin(autoIncrement.plugin, 'carType');
module.exports = mongoose.model('carType', carTypeSchema);
