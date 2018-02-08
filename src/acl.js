const Acl = require('acl');

class AclEx extends Acl {
  async roles() {
    const roles = await this.backend.getAsync(this.options.buckets.meta, 'roles');

    return roles;
  }
}

module.exports = AclEx;
