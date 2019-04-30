const mem = require("../util/mem")
const UserconfModel = require('../model/Userconf');

async function a(code) {
    let count =await UserconfModel.count({code:code,sex:'0'})
    if(count>=50){
    	await mem.set("big_tag_unknow_flag_" + code, 0, 60)
    }
}

module.exports = {a: a}