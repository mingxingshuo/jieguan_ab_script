const mem = require("../util/mem")
const UserconfModel = require('../model/Userconf');
const code =84

async function a() {
    let count =await UserconfModel.count({code:code,sex:'0'})
    if(count>=50){
    	await mem.set("big_tag_unknow_flag_" + code, 0, 60)
    }
}

module.exports = {a: a}