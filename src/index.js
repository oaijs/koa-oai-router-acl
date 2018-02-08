const assert = require('assert');
const Router = require('koa-oai-router');
const debug = require('debug')('koa-oai-router:acl');

const Acl = require('./acl');
const { defaultBefore, defaultAfter } = require('./plugin-args');

const { Plugin } = Router;

class AclPlugin extends Plugin {
  constructor() {
    super();

    this.pluginName = 'acl';
    this.field = 'x-oai-acl';
  }

  async init() {
    assert(typeof this.args === 'object', 'plugin arguments was not setted.');

    const {
      acl,
    } = this.args;

    assert(typeof acl === 'function', 'acl must be a factory function and return a acl instance.');

    this.acl = await acl(Acl);
  }

  async handler(docOpts) {
    const {
      resource,
      permission,
    } = docOpts.fieldValue;

    const {
      uid: getUid,
      before = defaultBefore,
      after = defaultAfter,
    } = this.args;

    debug('handling', docOpts.endpoint, resource, permission);
    debug('args', getUid, resource, permission);

    assert(typeof resource === 'string', 'resource should be string.');
    assert(typeof permission === 'string', 'permission should be string.');

    assert(typeof getUid === 'function', 'uid must be a function and return uid string.');
    assert(typeof before === 'function', 'before must be a koa middleware function.');
    assert(typeof after === 'function', 'after must be a koa middleware function.');

    return async (ctx, next) => {
      let nextCalled = false;
      await before(ctx, async () => {
        nextCalled = true;
        debug(`allowed by before to ${permission} ${resource}`);
        await next();
      });
      if (nextCalled) return;

      const uid = await getUid(ctx);
      const allowed = await this.acl.isAllowed(String(uid), resource, permission);
      debug(`user ${uid} is ${allowed ? 'allowed' : 'not allowed'} to ${permission} ${resource}`);

      await after(ctx, next, allowed);
    };
  }
}

module.exports = AclPlugin;
