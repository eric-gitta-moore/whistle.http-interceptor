
const getReqConfigFn = require("./getReqConfig")
const setResConfigFn = require("./setResConfig")

module.exports = async (ctx, next) => {
  const reqConfig = await getReqConfigFn(ctx)
  await setResConfigFn(ctx, reqConfig)
  next()
}