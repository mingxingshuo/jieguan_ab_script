var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var UserconfjgSchema = new Schema({
    openid: String,
    code: Number,
    sign: {type: Number, default: 0},          //标记
    sex: {type: String, default: "0"},
}, {
    timestamps: {createdAt: 'createAt', updatedAt: 'updateAt'}
});

var UserconfjgModel = db.model('Userconfjg', UserconfjgSchema);

module.exports = UserconfjgModel;