require("./utils/fixAndroid.js");
const Koa = require("koa");
const bodyParser = require("http-body-parser").koa;
const middleware = require("./middleware/middleware");

const app = new Koa();
// 错误处理
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.stack || err.message;
  }
});

app.use(
  bodyParser({ enableTypes: ["json", "form", "text", "multipart", "stream"] })
);
app.use(middleware);

const matchUrl = (pattern, url) => {
  // 将模式中的 ** 替换为一个特殊的占位符
  pattern = pattern.replace(/\*\*/g, "##");
  // 将模式中的 * 替换为一个正则表达式
  pattern = pattern.replace(/\*/g, "[^/]+");
  // 将特殊的占位符替换回 **
  pattern = pattern.replace(/##/g, ".*");
  // 构建一个新的正则表达式对象
  var regex = new RegExp("^" + pattern + "$");
  // 使用正则表达式测试给定的 URL 是否匹配模式
  return regex.test(url);
};
const findRules = (rules, method, url) => {
  return rules.find((rule) => {
    return (
      (rule.method == "*" ||
        rule.method.toLocaleLowerCase() == method.toLocaleLowerCase()) &&
      matchUrl(rule.url, url)
    );
  });
};

const serverCallback = app.callback();
exports.server = (server) => {
  server.on("request", (req, res) => {
    const { method } = req;
    const { url, ruleValue } = req.originalReq;
    // decache(rulesPath);
    const rules = eval(ruleValue);
    // console.log(rules);
    if (!Array.isArray(rules)) throw Error(`${rulesPath} 规则应该是一个数组`);
    const rule = findRules(rules, method, url);
    if (rule) {
      app.context.rule = rule;
      serverCallback(req, res);
    } else {
      req.passThrough();
    }
  });
};
