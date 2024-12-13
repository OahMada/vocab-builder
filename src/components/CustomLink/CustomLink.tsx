// https://web.dev/articles/route-prefetching-in-nextjs#prefetching_with_custom_routing

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

import Button from '@/components/Button';

type Ref = HTMLAnchorElement;
interface CustomLinkProps extends React.ComponentPropsWithoutRef<'a'> {
	// className: string;
	children: React.ReactNode;
	href: string;
	prefetch: boolean;
}

var CustomLink = React.forwardRef<Ref, CustomLinkProps>(function CustomLink({ href, children, prefetch, ...props }, forwardRef) {
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
		<Button>
			<StyledA href={href} onClick={handleClick} ref={forwardRef} {...props}>
				{children}
			</StyledA>
		</Button>
	);
});

export default CustomLink;

var StyledA = styled.a`
	text-decoration: none;
	color: black;
`;
