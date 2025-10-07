/* eslint-disable @typescript-eslint/no-explicit-any */
enum EStatus {
  OK = 'OK',
  FAIL = '',
}

interface Constructable<T> {
  new (...args: any): T;
}

export type TMaps = any;
export type TDriver = any;
export type TGeocoder = {
  geocode: (
    place: GeocodePromise,
    callback: TGeocodePromise
  ) => Promise<GeocodeResults[]>;
};
export type TService = () => any;
export type TBounds = {
  extend: (place: any) => any;
};
export type TAutocompleteService = Constructable<any>;
export type TAutocomplete = {
  getPlace: () => any;
  addListener: (eventType: string, callback: () => void) => void;
};
export type TMapService = Constructable<any>;
export type TMap = {
  fitBounds: (bounds: any) => void;
};
export type TMarker = Constructable<{
  map: any;
  position: any;
  icon: string;
}>;
export type TUnitSystem = any;
export type TAnimation = any;
export type TGeocodePromise = (
  results: GeocodeResults[],
  status: keyof typeof EStatus
) => void;
export type TGeocodeCallback = (results: GeocodeResults[]) => void;
export type TDistanceMatrixService = {
  getDistanceMatrix: TDistanceMatrixPromise;
};
export type TDistanceMatrixCallback = (
  results: any,
  status: keyof typeof EStatus
) => void;
export type TDistanceMatrixPromise = (
  distanceObject: DistanceObject,
  callback: TDistanceMatrixCallback
) => void;
export type TCurrent = {
  origins: Origin[];
  currentMarkers?: any;
  routes?: Route[];
  destination?: string;
  cost?: string;
};
export type TListener = (data: TCurrent) => void;

export type TTransportCost = {
  initialise: () => void;
  subscribe: (listener: TListener) => void;
  unsubscribe: (listener: TListener) => void;
};

export interface Route {
  name: string;
  address: any;
  duration: number;
  km: number;
  cost: string;
}

interface AutocompleteSettings {
  componentRestrictions: {
    country: string;
  };
}

interface MapSettings {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

interface Origin {
  name: string;
  text: string;
}

export interface Config {
  div: string;
  mapConfig: MapSettings;
  origins: Origin[];
  autocomplete: {
    div: string;
    settings: AutocompleteSettings;
  };
  distanceMatrixOptions: DistanceMatrixOptions;
  icons: {
    destination: string;
    origin: string;
    faster: string;
  };
  costs: {
    costPerMinute: number;
    hourBase: number;
    minimumCost: number;
  };
}

interface DistanceMatrixOptions {
  travelMode: string;
  avoidHighways: boolean;
  avoidTolls: boolean;
}

export interface DistanceObject extends DistanceMatrixOptions {
  origins: string[];
  destinations: Origin[];
  unitSystem: TUnitSystem;
}

export interface GeocodePromise {
  address: string;
}

export interface GeocodeResults {
  geometry: {
    location: any;
  };
}

export interface DistanceMatrixResults {
  originAddresses: string[];
  destinationAddresses: string[];
  rows: {
    elements: Element[];
  }[];
}

interface Element {
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
