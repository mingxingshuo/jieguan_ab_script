const wechat_util = require('../util/get_weichat_client.js')

async function a() {
    let code = process.argv.slice(2)[0]
    let client = await wechat_util.getClient(code)
    client.createTag("明星说未知", async function (err, data) {
        await UserTagModel.create({id: data.tag.id, name: "未知", code: code, sex: '0'})
    })
    client.createTag("明星说男", async function (err, data) {
        await UserTagModel.create({id: data.tag.id, name: "男", code: code, sex: '1'})
    })
    client.createTag("明星说女", async function (err, data) {
        await UserTagModel.create({id: data.tag.id, name: "女", code: code, sex: '2'})
    })
}
a()