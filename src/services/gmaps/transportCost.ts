import { InputDriver, MapConfig, MapDriver } from "./driver/driver";

// Config Object
export const mapConfig = {
	origins: [
		{
			name: "Pieroni srl, Diecimo, Lucca",
			address: "Pieroni srl, Diecimo, Lucca",
			id: "Diecimo",
			coordinates: {
				lat: 43.95545625179135,
				lng: 10.50189202868833,
			},
		},
		{
			name: "Pieroni srl, via della Canovetta, Lucca",
			address: "Pieroni srl, via della Canovetta, Lucca",
			id: "Lucca",
			coordinates: {
				lat: 43.86263827514731,
				lng: 10.521366784508059,
			},
		},
	],
	distanceMatrixOptions: {
		travelMode: "DRIVING" as const,
		avoidHighways: false,
		avoidTolls: false,
	},
	mapConfig: {
		center: {
			lat: 43.9084255,
			lng: 10.5158615,
		},
		zoom: 13,
		mapId: "76b18e78ad699c4b99e86c27",
	},
	mapContainer: "map",
	autocompleteContainer: "autocomplete-container",
};

export type Location = {
	id: string;
	name: string;
	address: string;
	coordinates: {
		lat: number;
		lng: number;
	};
};

type Route = {
	name: string;
	km: number;
	duration: number;
	cost: string;
};

export type TransportState = {
	routes: Route[];
	destination: string | undefined;
};

type Listener = () => void;

type Config = {
	mapConfig: MapConfig;
	origins: Location[];
	costs?: CostConfig;
	distanceMatrixOptions: {
		travelMode: "DRIVING";
		avoidHighways: boolean;
		avoidTolls: boolean;
	};
};

type CostConfig = {
	costPerMinute: number;
	hourBase: number;
	minimumCost: number;
};

export const TransportCost = class {
	private InputDriver: InputDriver;
	private MapDriver: MapDriver;
	private Listeners: Listener[];
	private config: Config;
	private State: TransportState = {
		routes: [],
		destination: undefined,
	};

	constructor(
		inputDriver: typeof InputDriver,
		mapDriver: typeof MapDriver,
		config: Config,
	) {
		this.InputDriver = new inputDriver();
		this.MapDriver = new mapDriver();
		this.Listeners = [];
		this.config = config;
	}

	public initialise = (
		inputContainer: HTMLElement,
		mapContainer: HTMLElement,
		costConfig: CostConfig,
	) => {
		this.InputDriver.init(inputContainer, this.onInputLocation);
		this.MapDriver.init(mapContainer, {
			...this.config.mapConfig,
			distanceMatrixOptions: this.config.distanceMatrixOptions,
		});
		this.config.costs = costConfig;
	};

	private onInputLocation = async (location: Location) => {
		this.State.destination = location.address;
		this.calculateTotalCost(location);
	};

	private calculateTotalCost = async (destination: Location) => {
		const routes = await this.MapDriver.calculateDistances({
			origins: this.config.origins,
			destination,
		});

		const routesWithCost = routes.map((route) => ({
			...route,
			name: this.config.origins.find((o) => o.id === route.id)?.name || "",
			cost: this.calculateCost(route.duration),
		}));
		this.State.routes = routesWithCost;

		this.emit();
	};

	private calculateCost = (routeMinutes: number) => {
		if (!this.config?.costs) {
			throw new Error("Costs not configured");
		}

		const { costPerMinute, hourBase, minimumCost } = this.config.costs;

		// if car is 1 minute => truck is 1.5 minutes
		const truckMinutes = routeMinutes * 1.5;

		const costToRun = truckMinutes * costPerMinute;

		// Find Cost
		const cost = costToRun + hourBase;
		// total or minimum
		const resultingCost = minimumCost <= cost ? cost : minimumCost;

		return resultingCost.toFixed(2);
	};

	private emit = () => {
		this.State = { ...this.State };
		this.Listeners.forEach((listener) => listener());
	};

	public getState = () => this.State;

	public subscribe = (listener: Listener) => {
		this.Listeners = [...this.Listeners, listener];
		return () => this.unsubscribe(listener);
	};

	public unsubscribe = (listener: Listener) => {
		this.Listeners = [...this.Listeners].filter(
			(inListener) => inListener.toString() === listener.toString(),
		);
	};
};
