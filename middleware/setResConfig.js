const got = require("got");
module.exports = async function (ctx, reqConfig) {
  const gotReqConfig = formatGotConfig(reqConfig);
  const gotRes = gotReqConfig ? await got(gotReqConfig) : false;
  const resConfig = getResConfigByGotRes(gotRes);
  const config = await new Promise((resolve, reject) => {
    if (ctx.rule.beforeSendResponse) {
      ctx.rule.beforeSendResponse(reqConfig, resConfig, resolve);
    } else {
      resolve(resConfig);
    }
  });

  if (config) {
    ctx.status = config.statusCode;
    ctx.set(config.headers);
    ctx.body = config.body;
  } else {
    // ctx.status = 404;
  }
};

const formatGotConfig = reqConfig => {
  const { url, method, headers, bodyType, query, body } = reqConfig;
  const config = {
    url,
    method,
    headers,
    searchParams: formatQuery(query),
    decompress: false, //自动解压响应
    allowGetBody: true, // get可以附带body
    throwHttpErrors: false, //禁止抛出错误
    retry: 0 //禁止重试
  };
  switch (bodyType) {
    case "formData":
      if (body) {
        const formData = new FormData();
        for (const key in body) {
          formData.append(key, body[key]);
        }
        config.body = formData;
      }
      break;
    case "form":
      config.form = body;
      break;
    case "json":
      config.json = body;
      break;
    case "text":
      config.body = body;
      break;
    default:
      config.body = body;
      break;
  }
  return config;
};

const getResConfigByGotRes = gotRes => {
  if (!gotRes) return {};
  const { statusCode, headers, body, rawBody } = gotRes;
  const config = {
    statusCode,
    headers,
    body
  };
  const contentType = headers["content-type"] || "";
  if (contentType.includes("json")) {
    config.body = JSON.parse(body);
  } else if (contentType.includes("text") || contentType.includes("javascript") || contentType.includes("xml")) {
    config.body = body;
  } else {
    config.body = rawBody;
  }
  return config;
};
const formatQuery = query => {
  const searchParams = [];
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      value.forEach(v => searchParams.push([key, v]));
    } else {
      searchParams.push([key, value]);
    }
  }
  return new URLSearchParams(searchParams).toString();
};
