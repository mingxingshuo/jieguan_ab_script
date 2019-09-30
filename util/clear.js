const mem = require("./mem")
var wechat_util = require('../util/get_weichat_client.js')
var ConfigModel = require('../model/Config');

async function clear(code) {
    console.log('-------清空调用次数flag------')
    let flag = await mem.get('dahao_script_clear_' + code)
    let times = await mem.get('dahao_script_clear_times_' + code) || 0
    let limit = await mem.get('dahao_script_clear_limit_' + code)
    if (flag) {
        return
    }
    if (limit) {
        return
    }
    if (times >= 1) {
        return
    }
    let conf = await ConfigModel.findOne({code: code})
    let appid = conf.appid
    let client = await wechat_util.getClient(code)
    client.clearQuota(appid, async function (err, data) {
        console.log('-------清空调用次数返回------')
        if (err && err.code && (err.code == 48006 || err.code == 45009)) {
            await mem.set('dahao_script_clear_limit_' + code, 1, 24 * 60 * 60)
        } else {
            await mem.set('dahao_script_clear_' + code, '1', 60)
            await mem.set('dahao_script_clear_times_' + code, times + 1, 24 * 60 * 60)
            await mem.set("big_follow_flag_" + code, 0, 1)
            await mem.set("big_user_flag_" + code, 0, 1)
            await mem.set("big_tag_female_flag_" + code, 0, 1)
            await mem.set("big_tag_male_flag_" + code, 0, 1)
            await mem.set("big_tag_unknow_flag_" + code, 0, 1)
            await mem.set('big_user_ending_' + code, 0, 1)

            setTimeout(function () {
                console.log('-------重置清空flag------')
                mem.set('dahao_script_clear_' + code, '', 60).then(function () {

                })
            }, 30 * 1000)
        }
    })
};
module.exports.clear = clear

