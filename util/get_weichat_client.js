var API = require('wechat-api');
var ConfigModel = require('../model/Config');
var mem = require('../util/mem.js');

async function getClient(code) {
    // let appid = await mem.get("configure_" + code)
    // if(!appid){
    let conf = await ConfigModel.findOne({code:code})
    let appid = conf.appid
    await mem.set("configure_" + code, appid, 30 * 24 * 3600)
    // }
    let api = await Singleton.getInterface(appid)
    // console.log(api.api, '----------------------api')
    return api.api;
}

class Singleton {
    constructor(appid) {
        var api = new API(appid);
        this.api = api
    }

    static async getInterface(appid) {
        if (!Singleton[appid]) {
            Singleton[appid] = new Singleton(appid)
            let token = await mem.get('access_token_' + appid)
            let access_token = token.split('!@#')[0]
            let expires_in = token.split('!@#')[1]
            Singleton[appid].api.setToken(appid,access_token,expires_in)
        }
        return Singleton[appid];
    }

    setToken(appid,token, expires_in) {
        console.log(token,expires_in,'------------------------token')
        this.api.store = {accessToken: token, expireTime: Date.now() + (expires_in - 10) * 1000}
        this.api.token = {accessToken: token, expireTime: Date.now() + (expires_in - 10) * 1000}
    }
}


module.exports = Singleton
module.exports.getClient = getClient;
