interface Object<T> {
  [key: string]: T;
}

export const normaliseObjectKeysToArray: <T, P extends Object<T>>(
  object: P
) => T[] = (object) => {
  if (typeof object === 'object' && object !== null && !Array.isArray(object)) {
    return Object.keys(object).map((key) => object[key]);
  } else {
    throw new Error('The argument passed is not an object');
  }
};
