const OpenidModel = require('../model/Openidjg');
const RecordModel = require('../model/Record')
const wechat_util = require('../util/get_weichat_client.js')
const mem = require("../util/mem")

async function users(code) {
    let record = await RecordModel.findOne({code: code})
    if (record) {
        let openid = record.follow_openid
        get_users(code, openid)
    } else {
        get_users(code, null)
    }
}

async function get_users(code, openid) {
    let openidCount = await OpenidModel.count({code: code})
    if (openidCount >= 100000) {
        await mem.set("big_follow_flag_" + code, 0, 1)
        return
    }
    let client = await wechat_util.getClient(code)
    if (openid) {
        client.getFollowers(openid, async function (err, result) {
            console.log(result,'------------------follow')
            if (err) {
                console.log(err, '------------------error')
            } else {
                if (result.errcode) {
                    await RecordModel.findOneAndUpdate({code: code}, {
                        code: code,
                        follow_openid: openid,
                        follow_errcode: result.errcode
                    }, {upsert: true})
                    return
                }
                if (result && result.data && result.data.openid) {
                    var openids = [];
                    for (var index in result.data.openid) {
                        openids.push({'openid': result.data.openid[index], 'code': code});
                    }
                    OpenidModel.insertMany(openids, async function (error, docs) {
                        if (error) {
                            console.log('------insertMany error--------');
                            console.log(error);
                            console.log('------------------------------');
                            return get_users(code, openid);
                        }
                        if (result.next_openid) {
                            await RecordModel.findOneAndUpdate({code: code}, {
                                follow_openid: result.next_openid,
                                $inc: {follow_count: result.count}
                            }, {upsert: true})
                            console.log('-----------code -------' + code + '---------update--contitue------')
                            get_users(code, result.next_openid);
                        } else {
                            await RecordModel.findOneAndUpdate({code: code}, {
                                follow_openid: result.data.openid[result.data.openid.length - 1],
                                $inc: {follow_count: result.count}
                            }, {upsert: true})
                            console.log(code + '-------follow---end')
                            return
                        }
                    })
                } else {
                    console.log(code + '-------follow---end')
                    return
                }
            }
        });
    } else {
        client.getFollowers(async function (err, result) {
            console.log(result,'------------------follow')
            if (err) {
                console.log(err, '------------------error')
            } else {
                if (result.errcode) {
                    await RecordModel.findOneAndUpdate({code: code}, {
                        code: code,
                        follow_openid: openid,
                        follow_errcode: result.errcode
                    }, {upsert: true})
                    return
                }
                if (result && result.data && result.data.openid) {
                    var openids = [];
                    for (var index in result.data.openid) {
                        openids.push({'openid': result.data.openid[index], 'code': code});
                    }
                    OpenidModel.insertMany(openids, async function (error, docs) {
                        if (error) {
                            console.log('------insertMany error--------');
                            console.log(error);
                            console.log('------------------------------');
                            return get_users(code, openid);
                        }
                        if (result.next_openid) {
                            await RecordModel.findOneAndUpdate({code: code}, {
                                follow_openid: result.next_openid,
                                $inc: {follow_count: result.count}
                            }, {upsert: true})
                            console.log('-----------code -------' + code + '---------update--contitue------')
                            get_users(code, result.next_openid);
                        } else {
                            await RecordModel.findOneAndUpdate({code: code}, {
                                follow_openid: result.data.openid[result.data.openid.length - 1],
                                $inc: {follow_count: result.count}
                            }, {upsert: true})
                            console.log(code + '-------follow---end')
                            return
                        }
                    })
                } else {
                    console.log(code + '-------follow---end')
                    return
                }
            }
        });
    }
}


module.exports = {users: users}