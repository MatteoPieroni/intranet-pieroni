export const permissions = [
  'read/riscossi',
  'write/riscossi',
  'write/gmb',
  'write/config',
  'admin',
] as const;

type Permission = (typeof permissions)[number];

const checkForPermission =
  (permissionToCheck: Permission) => (userPermissions?: Permission[]) => {
    return !!userPermissions?.some(
      (permission) => permission === permissionToCheck
    );
  };

export const checkIsAdmin = checkForPermission('admin');

const withIsAdmin =
  (additionalCheck: ReturnType<typeof checkForPermission>) =>
  (permissions?: Permission[]) =>
    checkIsAdmin(permissions) || additionalCheck(permissions);

export const checkCanEditRiscossi = withIsAdmin(
  checkForPermission('write/riscossi')
);

export const checkCanEditConfig = withIsAdmin(
  checkForPermission('write/config')
);

export const checkCanEditGMB = withIsAdmin(checkForPermission('write/gmb'));
