var Memcached = require('memcached');
var memcached = new Memcached('127.0.0.1:11211');
let prefix = require('../conf/proj.json').memcache_prefix;

module.exports.get = function(key){
    return new Promise((resolve, reject)=>{
        memcached.get(prefix+"_"+key,function(err,value){
            resolve(value);
        });
    });
}

module.exports.set = function(key,value,time){
    return new Promise((resolve, reject)=>{
        memcached.set(prefix+"_"+key,value,time,function(err,value){
            resolve(value);
        });
    });
}
