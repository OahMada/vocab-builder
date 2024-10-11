import type { Metadata } from 'next';

import { SITE_TITLE, SITE_DESC } from '@/constants';
import StyledComponentsRegistry from '@/lib/registry';

import './globals.css';

export const metadata: Metadata = {
	title: SITE_TITLE,
	description: SITE_DESC,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body>
				<StyledComponentsRegistry>{children}</StyledComponentsRegistry>
			</body>
		</html>
	);
}
