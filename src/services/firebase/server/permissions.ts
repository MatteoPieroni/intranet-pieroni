export const permissions = [
  'read/riscossi',
  'write/riscossi',
  'write/gmb',
  'write/config',
  'admin',
] as const;

export const checkCanEditRiscossi = (userPermissions?: string[]) => {
  return userPermissions?.some((permission) => permission === 'write/riscossi');
};
