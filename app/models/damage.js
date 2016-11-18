/**
 * Created by Yasaman on 2016-11-18.
 */
// app/models/models.js
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);
// define the schema for our damage model
var damageSchema = mongoose.Schema({
    description: String,
    amount: String,
    type: String,
    bill : { type: mongoose.Schema.Types.Number, ref: 'bill' },
});


// methods ======================
damageSchema.methods.find = function(){
    mongoose.find({}, function(err, docs) {
        if (err) {console.log("error occured in find for damage!")}
        else{
            // object of all the users
            console.log(docs);
            return docs;
        }

    });
},
    damageSchema.methods.findById = function(id){
        mongoose.findOne({_id: id}, function(err, damage) {
            if (err) {console.log("error occured in find for damage!")}
            else{
                // object of all the users
                console.log(damage);
                return damage;
            }

        });
    },
    damageSchema.set('toJSON', {
        getters: true,
        virtuals: true
    });
// create the model for damages and expose it to our app
damageSchema.plugin(autoIncrement.plugin, 'damage');
module.exports = mongoose.model('damage', damageSchema);

