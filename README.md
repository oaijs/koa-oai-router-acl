# Koa-OAI-Router-ACL

[license-img]: http://img.shields.io/badge/license-MIT-green.svg
[license-url]: http://opensource.org/licenses/MIT

[node-image]: https://img.shields.io/badge/node.js-v6.0.0-blue.svg
[node-url]: http://nodejs.org/download/

[npm-img]: https://img.shields.io/npm/v/koa-oai-router-acl.svg
[npm-url]: https://npmjs.org/package/koa-oai-router-acl

[travis-img]: https://travis-ci.org/oaijs/koa-oai-router-acl.svg
[travis-url]: https://travis-ci.org/oaijs/koa-oai-router-acl

[coveralls-img]: https://coveralls.io/repos/github/oaijs/koa-oai-router-acl/badge.svg
[coveralls-url]: https://coveralls.io/github/oaijs/koa-oai-router-acl

[downloads-image]: https://img.shields.io/npm/dm/koa-oai-router-acl.svg
[downloads-url]: https://npmjs.org/package/koa-oai-router-acl

[david-img]: https://img.shields.io/david/oaijs/koa-oai-router-acl.svg
[david-url]: https://david-dm.org/oaijs/koa-oai-router-acl

[router]: https://github.com/BiteBit/koa-oai-router

[![License][license-img]][license-url]
[![Node Version][node-image]][node-url]
[![NPM Version][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![Test Coverage][coveralls-img]][coveralls-url]
[![Downloads][downloads-image]][downloads-url]
[![Dependency Status][david-img]][david-url]

ACL plugin [koa-oai-router][router]

# Installation
```bash
npm i koa-oai-router-acl --save
```

# Info
|field|type|info|
|---|---|---|
|name|`string`|`acl`|
|evoked fields|`string`| `x-oai-acl`|
|evoked fileds value|`object`|`{resource,permission}`|
|options|`object`|`acl`, `getUid`, `before`, `after`|

* `options` `{object}`
 * `acl` `{function}` acl factory function. having args `(Acl)` and must return a acl instance.
 * `getUid` `{function}` get uid. having args `(ctx)` and must return a uid(`{string}`).
 * `before` `{function}` handle before acl permission test. having args `(ctx, next)`, `next` evoked will allow request.
 * `after` `{function}` handle after acl permission test. having args `(ctx, next, allowed)`.

 ```js
const Koa = require('koa');
const Router = require('koa-oai-router');
const MiddlewarePlugin = require('koa-oai-router-middleware');
const AclPlugin = require('koa-oai-router-acl');
const Redis = require('ioredis');

const app = new Koa();
const router = new Router({
  apiDoc: './api',
  options: {
    MiddlewarePlugin: './controllers',
    AclPlugin: {
      acl: async (Acl) => {
        const redis = new Redis({ keyPrefix: 'acl_test' });

        await new Promise((resolve, reject) => {
          redis.once('ready', resolve);
          redis.once('error', reject);
        });

        return new Acl(new Acl.redisBackend(redis));
      },
      uid: (ctx) => {
        // you uid code.
        return ctx.session.userId;
      },
    },
  },
});

router.mount(AclPlugin);
router.mount(MiddlewarePlugin);

app.use(router.routes());
 ```