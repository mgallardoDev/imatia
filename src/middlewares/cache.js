const { redisClient } = require("../helpers/redis.controller");

const redisCache = (key) => {
  return async (req, res, next) => {
    const value = await redisClient.get(key);
    if (value) {
      res.status(200).json({
        status: "ok",
        msg: "from cache",
        payload: JSON.parse(value),
      });
    } else {
      next();
    }
  };
};

const redisCacheWithIdParam = (key) => {
  return async (req, res, next) => {
    const {id}  = req.params
    const value = await redisClient.get(key+id);
    if (value) {
      res.status(200).json({
        status: "ok",
        msg: "from cache",
        payload: JSON.parse(value),
      });
    } else {
      next();
    }
  };
};

/**
 *
 * CODIGO NO VALIDO PARA LA VERSION 4 de REDIS
 *
 */
// const redisCache = (key) => {
//   return (req, res, next) => {
//     redisClient.get(key, (err, data) => {
//       if (err) {
//         console.log("no hay en cache");
//         next();
//       }
//       if (data !== null) {
//         console.log("SI hay en cache");
//         res.status(200).json({
//           status: "ok",
//           msg: "from cache",
//           payload: data,
//         });
//       }
//       next();
//     });
//   };
// };

module.exports = { redisCache, redisCacheWithIdParam };
