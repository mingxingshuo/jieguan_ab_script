var wechat_util = require('../util/get_weichat_client.js')

async function a() {
    let code = process.argv.slice(2)[0]
    let client = await wechat_util.getClient(code)
    client.clearQuota(appid, async function (err, data) {
        console.log(data,'-------------------data')
        console.log(err,'-------------------err')
    })
}
a()