const UserconfModel = require('../model/Userconfjg');
const UserTagModel = require('../model/UserTag')
const RecordModel = require('../model/Record')
const wechat_util = require('../util/get_weichat_client.js')
const mem = require("../util/mem")
const Mclear = require("../util/clear")

var flag = 0

async function tag(code, ab_flag) {
    let tags = await UserTagModel.find({code: code, sex: '1'})
    get_tag(null, code, tags, '1', ab_flag)
}

function get_tag(_id, code, tags, sex, ab_flag) {
    if (code) {
        update_tag(_id, code, tags, sex, ab_flag, get_tag);
    } else {
        console.log('------男----------update_tag end');
        mem.set("big_tag_male_flag_" + code, 0, 1).then(function () {

        })
        return
    }
}

function update_tag(_id, code, tags, sex, ab_flag, next) {
    let tagId = tags[0].id
    if (ab_flag) {
        tagId = tags[flag].id
        flag = (flag + 1) % 2
    }
    UserconfModel.fetchTag(_id, code, sex, async function (error, users) {
        if (users.length < 50) {
            // let end = await mem.get('big_user_ending_' + code)
            // if (!end) {
            await mem.set("big_tag_male_flag_" + code, 0, 1)
            return next(null, null, null, null, null)
            // } else {
            //     return next(null, null, null, null, null)
            // }
        }
        console.log('-------男  打标签---------')
        var user_arr = [];
        users.forEach(function (user) {
            user_arr.push(user.openid)
        })
        let client = await wechat_util.getClient(code)
        if (user_arr.length == 0) {
            console.log(user_arr, '-------------------user null')
            return next(null, null, null, null, null)
        } else {
            client.membersBatchtagging(tagId, user_arr, async function (error, res) {
                if (error) {
                    console.log('----男 打标签 error------')
                    if (error.code == 45009) {
                        Mclear.clear(code);
                        return
                    } else {
                        if (error.code == 45159) {
                            console.log('tagId----------', tagId)
                        }
                        return next(users[49]._id, code, tagId, sex, ab_flag);
                    }
                }
                if (res.errcode) {
                    console.log('----男 打标签 res error------')
                    console.log(res)
                    await RecordModel.findOneAndUpdate({code: code}, {
                        code: code,
                        tag_openid: user_arr[0],
                        tag_errcode: res.errcode
                    }, {upsert: true})
                    return next(users[49]._id, code, tagId, sex, ab_flag);
                }
                await UserconfModel.remove({code: code, openid: {$in: user_arr}})
                await RecordModel.findOneAndUpdate({code: code}, {
                    tag_openid: user_arr[user_arr.length - 1],
                    $inc: {tag_count: user_arr.length}
                }, {upsert: true})
                if (users.length == 50) {
                    return next(users[49]._id, code, tagId, sex, ab_flag);
                } else {
                    return next(null, null, null, null, null)
                }
            })
        }
    })
}

module.exports = {tag: tag}

