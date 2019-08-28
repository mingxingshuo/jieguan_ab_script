var API = require('wechat-api');
var ConfigModel = require('../model/Config');
var mem = require('../util/mem.js');

async function getClient(code) {
    let appid = await mem.get("configure_" + code)
    if(!appid){
        let conf = await ConfigModel.findOne({code:code})
        appid = conf.appid
        await mem.set("configure_" + code, appid, 30 * 24 * 3600)
    }
    let api = Singleton.getInterface(appid)
    // console.log(api.api, '----------------------api')
    return api.api;
}

class Singleton {
    constructor(appid) {
        var api = new API(appid);
        this.api = api
    }

    static getInterface(appid) {
        if (!Singleton[appid]) {
            Singleton[appid] = new Singleton(appid)
        }
        return Singleton[appid];
    }

    setToken(appid, token, expires_in) {
        this.api.store = {accessToken: token, expireTime: Date.now() + (expires_in - 10) * 1000}
        this.api.token = {accessToken: token, expireTime: Date.now() + (expires_in - 10) * 1000}
    }
}


module.exports = Singleton
module.exports.getClient = getClient;
