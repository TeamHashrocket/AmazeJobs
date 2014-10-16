var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// find all frits, sorted by date
UserSchema.statics.getAllFrits = function (callback) {
    Frit.find({}).sort({ createdOn: 'desc' }).exec(function (err, frits) {
        Frit.populate(frits, { path: "author" }, function (err, frits) {
            return callback(err, frits);
        });
    });
}


var User = mongoose.model('User', UserSchema);
module.exports = User;