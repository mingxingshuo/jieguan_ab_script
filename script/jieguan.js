const schedule = require("node-schedule");
const follow = require('./test_follow')
const user = require('./test_user')
const female = require('./test_tag_female')
const male = require('./test_tag_male')
const unknow = require('./test_tag_unknow')
const clear_mem = require('./clear_mem')
const mem = require("../util/mem")
var code = parseInt(process.env.code)

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
        user.get_user(code)
        await mem.set("big_user_flag_" + code, 1, 60 * 60)
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

// var rule3 = new schedule.RecurrenceRule();
// rule3.second = [1]
//
// schedule.scheduleJob(rule3, async function () {
//     await clear_mem.a(code)
// })
