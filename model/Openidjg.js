var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect_url = require('../conf/proj.json').mongodb;
var db = mongoose.createConnection(connect_url);

var OpenidjgSchema = new Schema({
    openid: String,
    code: Number
});

OpenidjgSchema.statics = {
    fetch(id, code, cb){
        if (id) {
            return this.find({_id: {$lt: id}, code: code}, ['openid'])
                .limit(100)
                .sort({'_id': -1})
                .exec(cb);
        } else {
            return this.find({code: code}, ['openid'])
                .limit(100)
                .sort({'_id': -1})
                .exec(cb);
        }
    }
}

var OpenidjgModel = db.model('Openidjg', OpenidjgSchema);

module.exports = OpenidjgModel;