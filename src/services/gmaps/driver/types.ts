/* eslint-disable @typescript-eslint/no-explicit-any */
enum EStatus {
  OK = 'OK',
  FAIL = ''
}

export type TMaps = any;
export type TDriver = any;
export type TGeocoder = {
  geocode: (place: IGeocodePromise, callback: TGeocodePromise) => Promise<IGeocodeResults[]>;
};
export type TService = () => any;
export type TBounds = {
  extend: (place: any) => any;
};
export type TAutocompleteService = Constructable<any>;
export type TAutocomplete = {
  getPlace: () => any;
  addListener: (eventType: string, callback: () => void) => void;
}
export type TMapService = Constructable<any>;
export type TMap = {
  fitBounds: (bounds: any) => void;
};
export type TMarker = Constructable<{
  map: any;
  position: any;
  icon: string;
}>
export type TUnitSystem = any;
export type TGeocodePromise = (results: IGeocodeResults[], status: keyof typeof EStatus) => void;
export type TGeocodeCallback = (results: IGeocodeResults[]) => void;
export type TDistanceMatrixService = {
  getDistanceMatrix: TDistanceMatrixPromise;
}
export type TDistanceMatrixCallback = (results: any, status: keyof typeof EStatus) => void;
export type TDistanceMatrixPromise = (distanceObject: IDistanceObject, callback: TDistanceMatrixCallback) => void;
export type TCurrent = {
  origins: IOrigin[];
  currentMarkers?: any;
  routes?: IRoute[];
  cost?: string;
}

export interface IRoute {
  name: string;
  address: any;
  duration: number;
  km: number;
  cost: string;
}

interface IAutocompleteSettings {
  componentRestrictions: {
    country: string;
  };
}

interface IMapSettings {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

interface IOrigin {
  name: string;
  text: string;
}

export interface IConfig {
  div: string;
  mapConfig: IMapSettings;
  origins: IOrigin[];
  autocomplete: {
    div: string;
    settings: IAutocompleteSettings;
  };
  distanceMatrixOptions: IDistanceMatrixOptions;
  icons: {
    destination: string;
    origin: string;
  };
}

interface IDistanceMatrixOptions {
  travelMode: string;
  avoidHighways: boolean;
  avoidTolls: boolean;
}

export interface IDistanceObject extends IDistanceMatrixOptions {
  origins: string[];
  destinations: IOrigin[];
  unitSystem: TUnitSystem;
}

export interface IGeocodePromise {
  address: string;
}

export interface IGeocodeResults {
  geometry: {
    location: any;
  };
}

export interface IDistanceMatrixResults {
  originAddresses: string[];
  destinationAddresses: string[];
  rows: {
    elements: IElement[];
  }[];
}

export interface IElement {
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
  status: EStatus;
}