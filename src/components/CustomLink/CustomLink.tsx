// https://web.dev/articles/route-prefetching-in-nextjs#prefetching_with_custom_routing

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

type Ref = HTMLAnchorElement;
interface CustomLinkProps extends React.ComponentPropsWithoutRef<'a'> {
	// className: string;
	children: React.ReactNode;
	href: string;
	prefetch: boolean;
}

var CustomLink = React.forwardRef<Ref, CustomLinkProps>(function ({ href, children, prefetch, ...props }, forwardRef) {
	let router = useRouter();

	React.useEffect(() => {
		if (prefetch) router.prefetch(href);
	}, [href, prefetch, router]);

	let handleClick = (e: React.SyntheticEvent) => {
		e.preventDefault();
		router.push(href);
		// https://stackoverflow.com/a/78317065/5800789
		router.refresh();
	};

	return (
		<a href={href} onClick={handleClick} ref={forwardRef} {...props}>
			{children}
		</a>
	);
});

CustomLink.displayName = 'CustomLink';

export default CustomLink;
