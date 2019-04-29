const schedule = require("node-schedule");
const follow = require('./test_follow')
const user = require('./test_user')
const tag = require('./test_tag')
const mem = require("../util/mem")
var code = 84

var rule = new schedule.RecurrenceRule();
var times = [1, 11, 21, 31, 41, 51];
rule.second = times;
var j = schedule.scheduleJob(rule, async function () {
    let follow_flag = mem.get('big_follow_flag_' + code)
    if (!follow_flag) {
        follow.users(code)
        await mem.set("big_follow_flag_" + code, 1, 60 * 60)
    }
    let user_flag = mem.get('big_user_flag_' + code)
    if (!user_flag) {
        user.get_user(code)
        await mem.set("big_user_flag_" + code, 1, 60 * 60)
    }
    tag.tag(code)
});