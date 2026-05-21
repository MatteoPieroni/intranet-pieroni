"use client";

import { useEffect, useSyncExternalStore } from "react";

import {
	mapConfig,
	TransportCost,
	InputDriver,
	MapDriver,
	type TransportState,
} from "@/services/gmaps";
import { Route } from "./route";
import styles from "./map.module.css";
import { Surface } from "../surface/surface";

type MapProps = {
	transportCostMinimum: number;
	transportCostPerMinute: number;
	transportHourBase: number;
};

const TransportCostDriver = new TransportCost(
	InputDriver,
	MapDriver,
	mapConfig,
);

const initialState: TransportState = {
	routes: [],
	destination: undefined,
};

export const Map = ({
	transportCostMinimum,
	transportCostPerMinute,
	transportHourBase,
}: MapProps) => {
	const snapshot = useSyncExternalStore(
		TransportCostDriver.subscribe,
		TransportCostDriver.getState,
		() => initialState,
	);

	useEffect(() => {
		if (typeof window === undefined) {
			return;
		}

		const mapContainer = document.getElementById(mapConfig.mapContainer);
		const autocompleteContainer = document.getElementById(
			mapConfig.autocompleteContainer,
		);

		if (!mapContainer || !autocompleteContainer) {
			console.error("no div", { mapContainer, autocompleteContainer });
			return;
		}

		TransportCostDriver.initialise(autocompleteContainer, mapContainer, {
			costPerMinute: transportCostPerMinute,
			hourBase: transportHourBase,
			minimumCost: transportCostMinimum,
		});
	}, [transportCostMinimum, transportCostPerMinute, transportHourBase]);

	const { destination, routes } = snapshot;
	const [quickestRoute, ...remainingRoutes] = routes;

	return (
		routes &&
		routes.length > 0 && (
			<Surface level={0} className={styles.results}>
				<h2 className={styles.destination}>
					Destinazione
					<br />
					<strong>{destination}</strong>
				</h2>
				{quickestRoute && <Route route={quickestRoute} quickest />}
				{remainingRoutes?.map((route) => (
					<Route key={route.name} route={route} />
				))}
			</Surface>
		)
	);
};
