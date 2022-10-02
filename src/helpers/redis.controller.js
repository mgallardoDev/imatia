const { createClient } = require("redis");

const redisClient = createClient({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT
});

(async () => {
  console.log("conecct");
  await redisClient.connect();
})();

redisClient.on("connect", () => {
  console.log("Redis client connected");
});

module.exports = { redisClient };
