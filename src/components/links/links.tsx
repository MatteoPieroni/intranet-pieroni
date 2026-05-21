import { Link } from "@/services/firebase/db-types";
import styles from "./links.module.css";
import { Surface } from "../surface/surface";

interface LinkProps {
	links: Link[];
}

export const Links: React.FC<LinkProps> = ({ links }) => {
	return (
		<>
			<div className={styles.header}>
				<h2 data-testid="links-title">Link utili</h2>
			</div>
			<ul className={styles.list}>
				{links &&
					links.map(({ link, description }) => (
						<li key={link}>
							<Surface level={1} interactive>
								<a
									href={link}
									className={`${styles.link} `}
									target="_blank"
									rel="noopener noreferrer"
								>
									{description}
								</a>
							</Surface>
						</li>
					))}
			</ul>
		</>
	);
};
