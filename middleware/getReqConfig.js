module.exports = async function (ctx) {
  const fullUrl = new URL(ctx.req.originalReq.fullUrl);
  const url = fullUrl.origin + fullUrl.pathname;
  const bodyType = ctx.request.type.toLocaleLowerCase();
  const method = ctx.method.toLocaleLowerCase();
  const headers = ctx.req.originalReq.headers;
  const query = ctx.query;
  const body = ctx.request.body;
  const rawBody = ctx.request.rawBody;

  const getBodyType = type => {
    if (type.includes("multipart/form-data")) {
      return "formData";
    }
    if (type.includes("x-www-form-urlencoded")) {
      return "form";
    }
    if (type.includes("application/json")) {
      return "json";
    }
    if (type.includes("text/plain")) {
      return "text";
    }
    return "stream";
  };

  delete headers["accept-encoding"];
  const config = {
    url,
    method,
    headers,
    bodyType: getBodyType(bodyType),
    query,
    body: body || rawBody
  };
  return new Promise((resolve, reject) => {
    if (ctx.rule.beforeSendRequest) {
      ctx.rule.beforeSendRequest(config, resolve);
    } else {
      resolve(config);
    }
  });
};
