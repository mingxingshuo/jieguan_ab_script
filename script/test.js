var wechat_util = require('../util/get_weichat_client.js')
var ConfigModel = require('../model/Config');

async function a() {
    let conf = await ConfigModel.findOne({code: code})
    let appid = conf.appid
    let code = process.argv.slice(2)[0]
    let client = await wechat_util.getClient(code)
    client.clearQuota(appid, async function (err, data) {
        console.log(err, '----------err')
        console.log(data, '----------data')
    })
}
a()