const { initQuick } = require('../helpers/base');

describe('acl api', () => {
  it('roles', async () => {
    let aclClient = null;
    const { request, router } = await initQuick(async (acl) => {
      aclClient = acl;

      await acl.allow('admin', 'pets', 'findPets');
      await acl.allow('vip1', 'pets1', 'findPets');
      await acl.allow('vip2', 'pets2', 'findPets');
    });

    router.get('/roles', async (ctx) => {
      ctx.body = await aclClient.roles();
    });

    const ret = await request
      .get('/roles')
      .expect(200);

    expect(ret.body.sort()).toEqual(['admin', 'vip1', 'vip2']);
  });
});
