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

UserconfjgSchema.statics = {
    fetchTag(id, code, sex, cb){
        if (id) {
            return this.find({_id: {$lt: id}, code: code, sex: sex}, ['openid'])
                .limit(50)
                .sort({'_id': -1})
                .exec(cb);
        } else {
            return this.find({code: code, sex: sex}, ['openid'])
                .limit(50)
                .sort({'_id': -1})
                .exec(cb);
        }
    }
}

var UserconfjgModel = db.model('Userconfjg', UserconfjgSchema);

module.exports = UserconfjgModel;