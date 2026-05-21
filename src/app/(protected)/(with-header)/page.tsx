import { headers } from "next/headers";
import type { Metadata } from "next";

import { Quote } from "@/components/quote/quote";
import { WelcomeMessage } from "@/components/welcome-message/welcome-message";
import { Links } from "@/components/links/links";
import { Surface } from "@/components/surface/surface";
import {
	cachedGetUser,
	getQuote,
	getLinksForTeam,
} from "@/services/firebase/server";
import template from "./header-template.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
	title: "Intranet - Pieroni srl",
	description: "Intranet - benvenut*",
};

export default async function Home() {
	const authHeader = (await headers()).get("Authorization");
	const { currentUser } = await cachedGetUser(authHeader);

	if (!currentUser) {
		throw new Error("User not found");
	}

	const [links, quote] = await Promise.all([
		getLinksForTeam(authHeader, currentUser.teams || [""]),
		getQuote(authHeader),
	]);

	const name = currentUser.name;

	return (
		<main className={template.page}>
			<div className={template.header}>
				<WelcomeMessage name={name} />
			</div>
			<div className={styles.infoContainer}>
				<div>
					<Surface level={0} className={styles.linksContainer}>
						<Quote quote={quote} />
					</Surface>
				</div>
				<div>
					<Surface level={0} className={styles.linksContainer}>
						<Links links={links} />
					</Surface>
				</div>
			</div>
		</main>
	);
}
