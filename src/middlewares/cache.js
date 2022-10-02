const { redisClient } = require("../helpers/redis.controller");

const redisCache = (key) => {
  return async (req, res, next) => {
    const value = await redisClient.get(key);
    if (value) {
      console.log("SI hay en cache");
      res.status(200).json({
        status: "ok",
        msg: "from cache",
        payload: JSON.parse(value),
      });
    } else {
      console.log("NO hay en cache");
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

module.exports = { redisCache };
