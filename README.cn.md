# whistle.http-interceptor

[English](README.md) | [中文](README.cn.md)

一个使用 JavaScript 动态进行修改 HTTP 请求和响应的 whistle 插件。

## 安装

```bash
npm install -g github:eric-gitta-moore/whistle.http-interceptor
```

## 功能特性

- 拦截并修改 HTTP 请求和响应
- 支持使用通配符匹配 URL
- 通过 JavaScript 进行灵活配置
- 支持多种 HTTP body 类型（JSON、form、text、multipart、stream）

## 配置说明

### Rules 配置

在 whistle 中添加以下规则：

```
^/api/path/to/match* http-interceptor://{test.js}
```

### Values 配置

创建 test.js 文件，内容如下：

```js
module.exports = [
  {
    url: "**", // 匹配所有请求 URL
    method: "*", // 匹配所有 HTTP 方法
    // 在发送响应给客户端前修改数据
    beforeSendResponse(reqConfig, resConfig, next) {
      // 在这里修改响应数据
      let root = resConfig.body;
      // 你的修改逻辑
      next(resConfig);
    },
    // 在发送请求到服务器前修改数据（可选）
    beforeSendRequest(reqConfig, next) {
      // 在这里修改请求数据
      next(reqConfig);
    }
  }
];
```

## 使用示例

以下是一个修改响应数据的示例：

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

e.g. 1

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

e.g. 2

````js
^/api/common/tcc* http-interceptor://{t.js}

```t.js
function beforeSendResponse(reqConfig, resConfig, next) {
    let root = resConfig.body;
    root.data.showResultAuditInfo = true
    root.data.showMaterialAuditInfo = true
    next(resConfig);
}

module.exports = [
    {
        url: "**",
        method: "*",
        beforeSendResponse,
    },
];
```
````
