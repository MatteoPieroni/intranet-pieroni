import * as Types from "./driver/types";

// Config Object
export const mapConfig = {
	origins: [
		{
			name: "Pieroni srl, Diecimo, Lucca",
			text: "Diecimo",
			coordinates: {
				lat: 43.95545625179135,
				lng: 10.50189202868833,
			},
		},
		{
			name: "Pieroni srl, via della Canovetta, Lucca",
			text: "Lucca",
			coordinates: {
				lat: 43.86263827514731,
				lng: 10.521366784508059,
			},
		},
	],
	distanceMatrixOptions: {
		travelMode: "DRIVING",
		avoidHighways: false,
		avoidTolls: false,
	},
	mapConfig: {
		center: {
			lat: 43.9084255,
			lng: 10.5158615,
		},
		zoom: 13,
		mapId: "b994950262a4301394908a42",
	},
	div: "map",
	autocomplete: {
		div: "autocomplete",
		settings: {
			componentRestrictions: {
				country: "it",
			},
		},
	},
};

export const TransportCost = class {
	private Driver: Types.TDriver;
	private Listeners: Types.TListener[];

	constructor(driver: Types.TDriver, config: Types.Config, maps: unknown) {
		this.Driver = new driver(maps, config);
		this.Driver.subscribe(this.listenToChanges);
		this.Listeners = [];
	}

	public initialise: () => void = () => {
		this.Driver.initAutocomplete();
		this.Driver.initMap();
	};

	private listenToChanges: (data: Types.TCurrent) => void = (data) =>
		this.Listeners.forEach((listener) => listener(data));

	public subscribe: (listener: Types.TListener) => void = (listener) =>
		(this.Listeners = [...this.Listeners, listener]);

	public unsubscribe: (listener: Types.TListener) => void = (listener) =>
		(this.Listeners = [...this.Listeners].filter(
			(inListener) => inListener.toString() === listener.toString(),
		));
};
