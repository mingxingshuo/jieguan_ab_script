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
    let clear_data = await client_clear(client,appid)
    console.log('-------清空调用次数返回------')
    console.log(clear_data)
	setTimeout(function () {
        mem.set('dahao_script_clear_'+code,'',60).then(function () {

        })
    },30*1000)
};

function client_clear(client,appid){
    return new Promise((resolve, reject)=>{
      	client.clearQuota(appid, function (err, data) {
	        resolve(data)
	   	});
    });
}

module.exports.clear = clear

