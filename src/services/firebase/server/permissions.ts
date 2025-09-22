export const permissions = [
  'read/riscossi',
  'write/riscossi',
  'write/gmb',
  'write/config',
  'admin',
] as const;

const checkForPermission =
  (permissionToCheck: string) => (userPermissions?: string[]) => {
    return !!userPermissions?.some(
      (permission) => permission === permissionToCheck
    );
  };

export const checkIsAdmin = checkForPermission('admin');

const withIsAdmin =
  (additionalCheck: ReturnType<typeof checkForPermission>) =>
  (permissions?: string[]) =>
    checkIsAdmin() || additionalCheck(permissions);

export const checkCanEditRiscossi = withIsAdmin(
  checkForPermission('write/riscossi')
);
