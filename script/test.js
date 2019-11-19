var wechat_util = require('../util/get_weichat_client.js')
var ConfigModel = require('../model/Config');
const mem = require("../util/mem")

async function a() {
    let code = process.argv.slice(2)[0]
    // let conf = await ConfigModel.findOne({code: code})
    // let appid = conf.appid
    // let client = await wechat_util.getClient(code)
    // client.clearQuota(appid, async function (err, data) {
    //     console.log(err, '----------err')
    //     console.log(data, '----------data')
    // })
    let times = await mem.get('dahao_script_clear_times_' + code)
    console.log(times,'---------------------times')
}
a()