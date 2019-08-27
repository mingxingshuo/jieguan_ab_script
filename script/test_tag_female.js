const UserconfModel = require('../model/Userconfjg');
const UserTagModel = require('../model/UserTag')
const RecordModel = require('../model/Record')
const wechat_util = require('../util/get_weichat_client.js')
const mem = require("../util/mem")
const Mclear = require("../util/clear")

async function tag(code) {
    let tag = await UserTagModel.findOne({code: code, sex: '2'})
    get_tag(null, code, tag.id, '2')
}

function get_tag(_id, code, tagId, sex) {
    if (code) {
        update_tag(_id, code, tagId, sex, get_tag);
    } else {
        console.log('-----女----------update_tag end');
        mem.set("big_tag_female_flag_" + code, 0, 1)
        return
    }
}

function update_tag(_id, code, tagId, sex, next) {
    UserconfModel.fetchTag(_id, code, sex, async function (error, users) {
        console.log('-------女  打标签---------')
        var user_arr = [];
        users.forEach(function (user) {
            user_arr.push(user.openid)
        })
        let client = await wechat_util.getClient(code)
        if (user_arr.length == 0) {
            console.log(user_arr, '-------------------user null')
            return next(null, null, null, null)
        } else if (user_arr.length < 50) {
            client.membersBatchtagging(tagId, user_arr, async function (error, res) {
                if (error) {
                    console.log('----女 打标签 error------')
                    if (error.code == 45009) {
                        Mclear.clear(code);
                        return
                    } else {
                        if (error.code == 45159) {
                            console.log('tagId----------', tagId)
                        }
                        return next(null, null, null, null)
                    }
                }
                if (res.errcode) {
                    console.log('----女 打标签 res error------')
                    console.log(res)
                    await RecordModel.findOneAndUpdate({code: code}, {
                        code: code,
                        tag_openid: user_arr[0],
                        tag_errcode: res.errcode
                    }, {upsert: true})
                    return next(null, null, null, null)
                }
                await UserconfModel.remove({code: code, openid: {$in: user_arr}})
                await RecordModel.findOneAndUpdate({code: code}, {
                    tag_openid: user_arr[user_arr.length - 1],
                    $inc: {tag_count: user_arr.length}
                }, {upsert: true})
                return next(null, null, null, null)
            })
        } else {
            client.membersBatchtagging(tagId, user_arr, async function (error, res) {
                if (error) {
                    console.log('----女 打标签 error------')
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
                    console.log('----女 打标签 res error------')
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
    })
}

module.exports = {tag: tag}
