const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (() => {
    ac.grant('user')
        .createOwn('profile')
        .readOwn('profile')
        .updateOwn('profile')
        .deleteOwn('profile')
        .readAny('post')
    .grant('admin')
        .extend('user')
        .readAny('profile')
        .deleteAny('profile')

    return ac;
})();