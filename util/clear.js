const mem = require("./mem")
var wechat_util = require('../util/get_weichat_client.js')
var ConfigModel = require('../model/Config');

async function clear(code){
    console.log('-------清空调用次数flag------')
	let flag = await mem.get('dahao_script_clear_'+code)
    console.log(flag)
	if(flag){
		return
	}
	await mem.set('dahao_script_clear_'+code,'1',60)
    let conf = await ConfigModel.findOne({code: code})
    let appid = conf.appid
    let client = await wechat_util.getClient(code)
    client.clearQuota(appid, function (err, data) {
            console.log('-------清空调用次数返回------')
            console.log(data)
    });
    
	setTimeout(function () {
        console.log('-------重置清空flag------')
        mem.set('dahao_script_clear_'+code,'',60).then(function () {

        })
    },30*1000)
};
module.exports.clear = clear

