const mem = require("../util/mem")

async function a() {
    let code = process.argv.slice(2)[0]
    await mem.set("big_follow_flag_" + code, false, 1)
    await mem.set("big_user_flag_" + code, false, 1)
    await mem.set("big_tag_female_flag_" + code, false, 1)
    await mem.set("big_tag_male_flag_" + code, false, 1)
    await mem.set("big_tag_unknow_flag_" + code, false, 1)
    await mem.set('big_user_ending_' + code, false, 1)
    await mem.set('dahao_script_clear_' + code, '', 1)
    let follow_flag = await mem.get('big_follow_flag_' + code)
    console.log('-------------follow_flag----', follow_flag)
}
a()