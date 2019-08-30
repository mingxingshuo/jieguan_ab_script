const UserconfModel = require('../model/Userconfjg');
const UserTagModel = require('../model/UserTag')
const RecordModel = require('../model/Record')
const ConfigModel = require('../model/Config');
const wechat_util = require('../util/get_weichat_client.js')
const mem = require("../util/mem")
const Mclear = require("../util/clear")

async function tag(code) {
    let config = await ConfigModel.findOne({code: code})
    console.log(config,'-------------------------config')
    let tag, id
    if (config.attribute == 1) {
        tag = await UserTagModel.findOne({code: code, sex: '1'})
        id = tag.id
    } else if (config.attribute == 2) {
        tag = await UserTagModel.findOne({code: code, sex: '2'})
        id = tag.id
    } else {
        tag = await UserTagModel.findOne({code: code, sex: '0'})
        id = tag.id
    }
    get_tag(null, code, id, '0')
}

async function get_tag(_id, code, tagId, sex) {
    if (code) {
        update_tag(_id, code, tagId, sex, get_tag);
    } else {
        console.log('----未知----------update_tag end');
        await mem.set("big_tag_unknow_flag_" + code, 0, 1)
        return
    }
}

function update_tag(_id, code, tagId, sex, next) {
    UserconfModel.fetchTag(_id, code, sex, async function (error, users) {
            if (users.length < 50) {
                // let end = await mem.get('big_user_ending_' + code)
                // if (!end) {
                await mem.set("big_tag_unknow_flag_" + code, 0, 1)
                return next(null, null, null, null)
                // } else {
                //     return next(null, null, null, null)
                // }
            }
            console.log('-------未知  打标签---------')
            var user_arr = [];
            users.forEach(function (user) {
                user_arr.push(user.openid)
            })
            let client = await wechat_util.getClient(code)
            if (user_arr.length == 0) {
                console.log(user_arr, '-------------------user null')
                return next(null, null, null, null)
            } else {
                client.membersBatchtagging(tagId, user_arr, async function (error, res) {
                    if (error) {
                        console.log('----未知 打标签 error------')
                        if (error.code == 45009) {
                            Mclear.clear(code);
                            return
                        } else {
                            if (error.code == 45159) {
                                console.log('tagId----------', tagId)
                            }
                            return next(users[49]._id, code, tagId, sex);
                        }
                    }
                    if (res.errcode) {
                        console.log('----未知 打标签 res error------')
                        console.log(res)
                        await RecordModel.findOneAndUpdate({code: code}, {
                            code: code,
                            tag_openid: user_arr[0],
                            tag_errcode: res.errcode
                        }, {upsert: true})
                        return next(users[49]._id, code, tagId, sex);
                    }
                    await UserconfModel.remove({code: code, openid: {$in: user_arr}})
                    await RecordModel.findOneAndUpdate({code: code}, {
                        tag_openid: user_arr[user_arr.length - 1],
                        $inc: {tag_count: user_arr.length}
                    }, {upsert: true})
                    if (users.length == 50) {
                        return next(users[49]._id, code, tagId, sex);
                    } else {
                        return next(null, null, null, null)
                    }
                })
            }
        }
    )
}

module.exports = {tag: tag}

