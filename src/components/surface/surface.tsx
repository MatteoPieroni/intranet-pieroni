import styles from "./surface.module.css";

type SurfaceProps = {
	className?: string;
	level: 0 | 1 | 2 | 3 | 4 | 5;
	noOutline?: boolean;
	interactive?: boolean;
	radius?: "md";
	children: React.ReactNode;
};

const levelMap = {
	0: styles.sLevel0,
	1: styles.sLevel1,
	2: styles.sLevel2,
	3: styles.sLevel3,
	4: styles.sLevel4,
	5: styles.sLevel5,
};

export const Surface = ({
	className,
	level,
	noOutline = false,
	children,
	interactive = false,
	radius = "md",
}: SurfaceProps) => {
	const classes = [
		styles.surface,
		levelMap[level],
		!noOutline && styles.sOutline,
		interactive && styles.sHoverable,
		interactive && styles.sClickable,
		radius === "md" && styles.sRadiusMd,
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div className={classes}>
			<div className={styles.surfaceContent}>{children}</div>
		</div>
	);
};
