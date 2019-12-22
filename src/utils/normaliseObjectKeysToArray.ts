interface IObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
export const normaliseObjectKeysToArray: (obj: IObject) => IObject[] =
  object => {
    if (typeof object === 'object' && object !== null) {
      return Object.keys(object).map(key => object[key]);
    } else {
      return null;
    }
  };
