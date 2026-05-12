import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import Zod from "zod";

import { Location } from "../transportCost";
import { mToKm, msToMin } from "@/utils/formatMeasures";

const DestinationSchema = Zod.object({
	resourceName: Zod.string(),
	formattedAddress: Zod.string(),
	location: Zod.object({
		lat: Zod.number(),
		lng: Zod.number(),
	}),
});

export class InputDriver {
	constructor() {}

	init = async (
		container: HTMLElement,
		listener: (destination: Location) => void,
	) => {
		setOptions({ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS });

		const { PlaceAutocompleteElement } = await importLibrary("places");

		const autocompleteElement = new PlaceAutocompleteElement({
			includedRegionCodes: ["it"],
		});

		container.appendChild(autocompleteElement);

		autocompleteElement.addEventListener("gmp-select", async (event) => {
			const data = await this.placeSelected(event);
			listener(data);
		});
	};

	placeSelected = async (
		event: google.maps.places.PlacePredictionSelectEvent,
	) => {
		const { placePrediction } = event;
		const place = placePrediction.toPlace();

		const placeData = await place.fetchFields({
			fields: ["formattedAddress", "location"],
		});
		const destination = await placeData.place.toJSON();

		const parsed = DestinationSchema.parse(destination);

		return {
			id: parsed.resourceName,
			name: parsed.formattedAddress,
			address: parsed.formattedAddress,
			coordinates: {
				latitude: parsed.location.lat,
				longitude: parsed.location.lng,
			},
		};
	};
}

export type MapConfig = {
	center: { latitude: number; longitude: number };
	zoom: number;
	mapId: string;
};

export class MapDriver {
	private map: google.maps.Map | undefined = undefined;
	private config: MapConfig | undefined;
	private origins: Location[] = [];
	private destination: Location | undefined;

	constructor() {}

	public async init(container: HTMLElement, config: MapConfig) {
		this.config = config;

		setOptions({ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS });

		const { Map } = await importLibrary("maps");

		this.map = new Map(container, {
			center: {
				lat: this.config.center.latitude,
				lng: this.config.center.longitude,
			},
			zoom: this.config.zoom,
			mapId: this.config.mapId,
		});
	}

	public async calculateDistances({
		origins,
		destination,
	}: {
		origins: Location[];
		destination: Location;
	}) {
		this.origins = origins;
		this.destination = destination;

		const { Route, RouteMatrix } = await google.maps.importLibrary("routes");

		const request: google.maps.routes.ComputeRouteMatrixRequest = {
			origins: origins.map((o) => ({
				lat: o.coordinates.latitude,
				lng: o.coordinates.longitude,
			})),
			destinations: [
				{
					lat: destination.coordinates.latitude,
					lng: destination.coordinates.longitude,
				},
			],
			travelMode: "DRIVING",
			units: google.maps.UnitSystem.METRIC,
			fields: ["distanceMeters", "durationMillis"],
		};

		const { matrix } = await RouteMatrix.computeRouteMatrix(request);

		const calculatedRoutes = matrix.rows.map((row, i) => {
			if (!row.items[0].durationMillis || !row.items[0].distanceMeters) {
				throw new Error("No duration or distance");
			}

			// gmaps returns the value in milliseconds
			const duration = Math.ceil(msToMin(row.items[0].durationMillis));
			// gmaps returns the value in metres
			const km = Math.floor(mToKm(row.items[0].distanceMeters));

			return {
				id: origins[i].id,
				duration,
				km,
			};
		});

		this.paint();

		return calculatedRoutes;
	}

	private paint = () => {};
}
