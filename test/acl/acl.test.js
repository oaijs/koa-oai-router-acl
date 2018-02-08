const { initQuick } = require('../helpers/base');

describe('acl', () => {
  it('x-oai-acl is unset, should success', async () => {
    const { request } = await initQuick(async (acl) => {
      await acl.allow('admin', 'pets', 'findPets');
      await acl.addUserRoles('1234567', 'admin');
    });

    await request
      .get('/api/pets-unset')
      .expect(200);
  });

  it('have permission to resource, should success', async () => {
    const { request } = await initQuick(async (acl) => {
      await acl.allow('admin', 'pets', 'findPets');
      await acl.addUserRoles('1234567', 'admin');
    });

    await request
      .get('/api/pets')
      .expect(200);
  });

  it('not have permission to resource, should 403', async () => {
    const { request } = await initQuick(async (acl) => {
      await acl.allow('admin', 'pets', 'findPets');
      await acl.addUserRoles('12345671', 'admin');
    });

    await request
      .get('/api/pets')
      .expect(403);
  });
});
