const wechat_util = require('../util/get_weichat_client.js')
var async = require('async');
var UserTagModel = require('../model/UserTag')
var UserconfModel = require('../model/Userconfjg');
var OpenidModel = require('../model/Openidjg');
var RecordModel = require('../model/Record')

async function a() {
    let code = process.argv.slice(2)[0]
    let client = await wechat_util.getClient(code)
    async.waterfall([
        function (callback) {
            UserTagModel.remove({code: code}, function (err, doc) {
                client.getTags(function (err, res) {
                    if (res) {
                        console.log(res, '------------------res')
                        for (let i of res.tags) {
                            console.log(i, '--------------------i')
                            if (i.name == "明星说平台男" || i.name == "明星说平台女" || i.name == "明星说平台未知") {
                                client.deleteTag(i.id, function (error, res) {
                                    console.log(res)
                                })
                            }
                        }
                        callback(null)
                    } else {
                        callback(null)
                    }
                })
            })
        }, function (callback) {
            UserconfModel.remove({code: code}, function (err, doc) {
                OpenidModel.remove({code: code}, function (err, doc) {
                    RecordModel.remove({code: code}, function (err, doc) {
                        callback(null)
                    })
                })
            })
        }, function () {
            client.createTag("明星说平台未知", async function (err, data) {
                await UserTagModel.create({id: data.tag.id, name: "未知", code: code, sex: '0'})
            })
            client.createTag("明星说平台男", async function (err, data1) {
                await UserTagModel.create({id: data1.tag.id, name: "男", code: code, sex: '1'})
            })
            client.createTag("明星说平台女", async function (err, data2) {
                await UserTagModel.create({id: data2.tag.id, name: "女", code: code, sex: '2'})
            })
        }])
}
a()