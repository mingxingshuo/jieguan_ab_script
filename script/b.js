var wechat_util = require('../util/get_weichat_client.js')
var ConfigModel = require('../model/Config');

async function a() {
    let code = process.argv.slice(2)[0]
    let conf = await ConfigModel.findOne({code: code})
    let appid = conf.appid
    let client = await wechat_util.getClient(code)
    client.clearQuota(appid, async function (err, data) {
        console.log(data,'-------------------data')
        console.log(err,'-------------------err')
    })
}
a()