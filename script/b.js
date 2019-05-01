const UserconfModel = require('../model/Userconf');

async function a() {
    let code = process.argv.slice(2)[0]
    let count = await UserconfModel.count({code: code, sex: '0'})
    console.log(count, '------')
}
a()