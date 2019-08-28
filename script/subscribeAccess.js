const asyncRedis = require("async-redis");
const redis_client = asyncRedis.createClient();

redis_client.on("error", function (err) {
    console.log("redis Error " + err);
});

redis_client.on("subscribe", function (channel, count) {
    console.log('监听到订阅事件',channel, count)
});

redis_client.on("message", function (channel, message) {
    console.log('监听到发布事件')
    console.log("sub channel " + channel + ": " + message);
});

async function subscribeAccessToken(){
	await redis_client.subscribe('access_token');
}

subscribeAccessToken()
