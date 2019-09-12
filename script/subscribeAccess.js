const asyncRedis = require("async-redis");
const redis_client = asyncRedis.createClient();
const mem = require('../util/mem.js');
const Singleton = require('../util/get_weichat_client');

redis_client.on("subscribe", function (channel, count) {
    console.log('监听到订阅事件',channel, count)
});

redis_client.on("message", async function (channel, message) {
    console.log('监听到发布事件')
    console.log("sub channel " + channel + ": " + message);
    let appid = message;
    let token = await mem.get('access_token_' + appid)
    let access_token = token.split('!@#')[0]
    let expires_in = token.split('!@#')[1]
    let saveToken = await Singleton.getInterface(appid)
    saveToken.setToken(appid,access_token,expires_in)
});

async function subscribeAccessToken(){
	await redis_client.subscribe('access_token');
}

subscribeAccessToken()

