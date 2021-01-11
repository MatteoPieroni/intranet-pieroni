interface IObject<T> {
  [key: string]: T;
}

export const normaliseObjectKeysToArray: <T, P extends IObject<T>>(object: P) => T[] =
  object => {
    if (typeof object === 'object' && object !== null && !Array.isArray(object)) {
      return Object.keys(object).map(key => object[key]);
    } else {
      return null;
    }
  };
