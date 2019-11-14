const schedule = require("node-schedule");
const follow = require('./test_follow')
const user = require('./test_user')
const female = require('./test_tag_female')
const male = require('./test_tag_male')
const unknow = require('./test_tag_unknow')
const clear_mem = require('./clear_mem')
const mem = require("../util/mem")
const code = parseInt(process.env.code)
const wechat_util = require('../util/get_weichat_client.js')
const ConfigModel = require('../model/Config');
const exec = require('child_process').exec;
require('../script/subscribeAccess')
const asyncRedis = require("async-redis");
const redis_client = asyncRedis.createClient();


var rule = new schedule.RecurrenceRule();
let start = parseInt(Math.random() * 10)
var times = [start, start + 10, start + 20, start + 30, start + 40, start + 50];
rule.second = times;
schedule.scheduleJob(rule, async function () {
    let follow_flag = await mem.get('big_follow_flag_' + code)
    if (!follow_flag) {
        follow.users(code)
        await mem.set("big_follow_flag_" + code, 1, 24 * 60 * 60)
    } else {
        return
    }
})

var rule1 = new schedule.RecurrenceRule();
start = parseInt(Math.random() * 5)
var times1 = [start, start + 5 * 1, start + 5 * 2, start + 5 * 3, start + 5 * 4, start + 5 * 5, start + 5 * 6, start + 5 * 7, start + 5 * 8, start + 5 * 9, start + 5 * 10, start + 5 * 11];
rule1.second = times1;
schedule.scheduleJob(rule1, async function () {
    let user_flag = await mem.get('big_user_flag_' + code)
    if (!user_flag) {
        await mem.set("big_user_flag_" + code, 1, 60 * 60)
        // await mem.set('big_user_ending_' + code, 0, 1)
        user.get_user(code)
    } else {
        return
    }
})

var rule2 = new schedule.RecurrenceRule();
start = parseInt(Math.random() * 5)
var times2 = [start, start + 5 * 1, start + 5 * 2, start + 5 * 3, start + 5 * 4, start + 5 * 5, start + 5 * 6, start + 5 * 7, start + 5 * 8, start + 5 * 9, start + 5 * 10, start + 5 * 11];
rule2.second = times2;
schedule.scheduleJob(rule2, async function () {
    let tag_flag = await mem.get('big_tag_female_flag_' + code)
    if (!tag_flag) {
        female.tag(code)
        await mem.set("big_tag_female_flag_" + code, 1, 60 * 60)
    } else {
        return
    }
})
schedule.scheduleJob(rule2, async function () {
    let tag_flag = await mem.get('big_tag_male_flag_' + code)
    if (!tag_flag) {
        male.tag(code)
        await mem.set("big_tag_male_flag_" + code, 1, 60 * 60)
    } else {
        return
    }
})
schedule.scheduleJob(rule2, async function () {
    let tag_flag = await mem.get('big_tag_unknow_flag_' + code)
    console.log('-------------未知_flag----', tag_flag)
    console.log('-------未知 flag-------', !tag_flag)
    if (!tag_flag) {
        unknow.tag(code)
        await mem.set("big_tag_unknow_flag_" + code, 1, 60 * 60)
    } else {
        return
    }
})

var rule3 = new schedule.RecurrenceRule();
rule3.hour = 1

schedule.scheduleJob(rule3, async function () {
    await mem.set('dahao_script_clear_times_' + code, 0, 24 * 60 * 60)
    await mem.set('dahao_script_clear_limit_' + code, 0, 24 * 60 * 60)
    await mem.set("big_follow_flag_" + code, 0, 1)
    await mem.set("big_user_flag_" + code, 0, 1)
    await mem.set("big_tag_female_flag_" + code, 0, 1)
    await mem.set("big_tag_male_flag_" + code, 0, 1)
    await mem.set("big_tag_unknow_flag_" + code, 0, 1)
    await mem.set('big_user_ending_' + code, 0, 1)
    await mem.set('dahao_script_clear_' + code, 0, 1)
})

var rule4 = new schedule.RecurrenceRule();
rule4.hour = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
rule4.minute = [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56]

schedule.scheduleJob(rule4, async function () {
    let times = await mem.get('dahao_script_clear_times_' + code) || 0
    let limit = await mem.get('dahao_script_clear_limit_' + code)
    console.log(limit, times, '------------------------limit')
    if (!limit && times < 1) {
        let num = await mem.get('dahao_tag_num_' + code) || 0
        let current_num = 0
        let client = await wechat_util.getClient(code)
        client.getTags(async function (err, data) {
            console.log(err, data, '-----------------', code)
            for (let i of data.tags) {
                current_num += i.count
            }
            if(current_num == 0){
                return
            }
            console.log(num, current_num, '---------------------num')
            if (num >= current_num) {
                await mem.set('dahao_tag_num_' + code, 0, 1)
                await ConfigModel.update({code: code}, {status: 1})
                await redis_client.publish('clear_code', code);
                let cmdStr = 'pm2 stop ' + code
                exec(cmdStr, function () {
                })
            } else {
                await mem.set('dahao_tag_num_' + code, current_num, 60 * 60)
            }
        })
    }
})