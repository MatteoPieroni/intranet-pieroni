import { googleClient } from "@/services/google-apis";

import { Holidays } from "../holidays/holidays";
import styles from "./business.module.css";
import { GoogleReviews } from "../reviews/reviews";
import { GooglePerformance } from "../performance/performance";
import { Surface } from "@/components/surface/surface";

export const Business = async () => {
	const locations = await googleClient.getLocations();

	return (
		<div className={styles.container}>
			<Surface level={0} className={styles.section}>
				<h2>Review</h2>
				<GoogleReviews locations={locations} />
			</Surface>

			<Surface level={0} className={styles.section}>
				<h2>Performance</h2>
				<GooglePerformance locations={locations} />
			</Surface>

			<Surface level={0} className={styles.section}>
				<h2>Giorni di chiusura</h2>
				<Holidays locations={locations} />
			</Surface>
		</div>
	);
};
