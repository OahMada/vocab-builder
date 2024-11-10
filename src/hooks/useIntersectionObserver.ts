'use client';

import * as React from 'react';

export default function useIntersectionObserver(): [boolean, React.RefObject<HTMLDivElement>] {
	let scrollTrigger = React.useRef<null | HTMLDivElement>(null);
	let [isOnscreen, setIsOnscreen] = React.useState(false);

	React.useEffect(() => {
		if (!scrollTrigger.current) {
			return;
		}
		let observer = new IntersectionObserver(
			(entries) => {
				let [entry] = entries;
				setIsOnscreen(entry.isIntersecting);
			},
			{ threshold: 0.5 }
		);
		observer.observe(scrollTrigger.current);
		return () => {
			observer.disconnect();
		};
	}, []);

	return [isOnscreen, scrollTrigger];
}
