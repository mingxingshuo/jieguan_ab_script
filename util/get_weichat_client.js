const ConfigModel = require('../model/Config');
const mem = require('../util/mem.js');
const Singleton = require('/home/work/tuitui_cms/tuitui_weichat/util/get_weichat_client.js');

async function getClient(code) {
    let appid = await mem.get("configure_" + code)
    if(!appid){
        let conf = await ConfigModel.findOne({code:code})
        appid = conf.appid
        await mem.set("configure_" + code, appid, 30 * 24 * 3600)
    }
    let api = Singleton.getInterface(appid)
    return api.api;
}

module.exports.getClient = getClient;
