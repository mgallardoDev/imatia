const { createClient } = require("redis");

const redisClient = createClient({
    url: process.env.REDIS_URL || null
});

(async () => {
  await redisClient.connect();
})();

redisClient.on("connect", () => {
  console.log("Redis client connected");
});

module.exports = { redisClient };
