const { initQuick } = require('../helpers/base');

describe('acl after', () => {
  it('not have permission to resource, after handler pass. should success', async () => {
    async function handler(acl) {
      // await acl.allow('admin', 'pets', 'findPets');
      // await acl.addUserRoles('1234567', 'admin');
    }

    async function after(ctx, next, allowed) {
      await next();
    }

    const { request } = await initQuick(handler, after);

    await request
      .get('/api/pets')
      .expect(200);
  });

  it('have permission to resource, after handler throw 403. should 403', async () => {
    async function handler(acl) {
      await acl.allow('admin', 'pets', 'findPets');
      await acl.addUserRoles('12345671', 'admin');
    }

    async function after(ctx, next, allowed) {
      ctx.throw(403, 'go away..');
    }

    const { request } = await initQuick(handler, after);

    await request
      .get('/api/pets')
      .expect(403);
  });
});
