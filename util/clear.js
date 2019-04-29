const mem = require("./mem")
var wechat_util = require('../util/get_weichat_client.js')
async function clear(code){
	let flag = await mem.get('dahao_script_clear_'+code)
	if(flag){
		return
	}
	await mem.set('dahao_script_clear_'+code,'1',60)
    let conf = await ConfigModel.findOne({code: code})
    let appid = conf.appid
    let client = wechat_util.getClient(code)
    await client_clear(client,appid)
    await mem.set('dahao_script_clear_'+code,'',60)
};

function client_clear(client,appid){
    return new Promise((resolve, reject)=>{
      	client.clearQuota(appid, function (err, data) {
	        resolve(data)
	   	});
    });
}

module.exports.clear = clear

