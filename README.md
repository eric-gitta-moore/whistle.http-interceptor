# whistle.http-interceptor

[English](README.md) | [中文](README.cn.md)

A whistle plug-in that uses JavaScript to dynamically modify HTTP requests and responses.

## Installation

```bash
npm install -g github:eric-gitta-moore/whistle.http-interceptor
```

## Features

- Intercept and modify HTTP requests and responses
- Support for matching URLs using wildcards
- Flexible configuration through JavaScript
- Support various HTTP body types (JSON, form, text, multipart, stream)

## Configuration

### Rules Configuration

Add the following rule in whistle:

```
^/api/path/to/match* http-interceptor://{test.js}
```

### Values Configuration

Create a test.js file with the following content:

```js
module.exports = [
  {
    url: "**", // Match all request URLs
    method: "*", // Match all HTTP methods
    // Modify response before sending to client
    beforeSendResponse(reqConfig, resConfig, next) {
      // Modify response data here
      let root = resConfig.body;
      // Your modification logic
      next(resConfig);
    },
    // Modify request before sending to server (optional)
    beforeSendRequest(reqConfig, next) {
      // Modify request data here
      next(reqConfig);
    }
  }
];
```

## Example

Here's an example that modifies the response data:

```js
module.exports = [
  {
    url: "**",
    method: "*",
    beforeSendResponse(reqConfig, resConfig, next) {
      let root = resConfig.body;
      try {
        root.data.userWorks[0].renderStatus = 2;
        root.data.userWorks[0].failureType = 3;
      } catch (error) {}
      next(resConfig);
    },
  },
];
```

e.g.

````js
^/api/common/tcc* http-interceptor://{t.js}

```t.js
module.exports = [
  {
    url: "**", //匹配所有请求url
    method: "*",
    // 返回响应给客户端前 调用next()修改数据
    beforeSendResponse(reqConfig, resConfig, next) {
      let root = resConfig.body;
      root.data.showResultAuditInfo = true
      root.data.showMaterialAuditInfo = true
      next(resConfig);
    },
  },
];
```
````
