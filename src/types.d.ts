/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'react-router-dom';
declare module 'react-modal'

declare interface Window {
  google: {
    maps: any;
  };
}

interface IGenericProps {
  [key: string]: any;
}
interface Constructable<T> {
  new(...args: any): T;
}