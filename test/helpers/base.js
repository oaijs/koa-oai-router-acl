const Redis = require('ioredis');
const Middleware = require('koa-oai-router-middleware');

const Acl = require('../..');
const { init } = require('../helpers');

const noop = () => { };

async function initBase(opts) {
  const ret = await init({
    apiDoc: './test/acl/api',
    plugins: [Acl, Middleware],
    options: {
      middleware: './test/acl/controllers',
      acl: opts,
    },
  });

  return ret;
}

async function initQuick(handler = noop, before, after) {
  let aclClient = null;

  const rets = await initBase({
    acl: async (_Acl) => {
      const redis = new Redis({ keyPrefix: String(Math.random()) });
      aclClient = new _Acl(new _Acl.redisBackend(redis));

      await new Promise((resolve, reject) => {
        redis.once('ready', resolve);
        redis.once('error', reject);
      });

      await handler(aclClient);

      return aclClient;
    },
    uid: (ctx) => {
      return '1234567';
    },
    before,
    after,
  });

  rets.acl = aclClient;

  return rets;
}

module.exports = {
  initBase,
  initQuick,
};
