import type { Metadata } from 'next';

import { SITE_TITLE, SITE_DESC } from '@/constants';
import StyledComponentsRegistry from '@/lib/StyledComponentsRegistry';
import ToastProvider from '@/components/ToastProvider';

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
				<StyledComponentsRegistry>
					<ToastProvider>{children}</ToastProvider>
				</StyledComponentsRegistry>
			</body>
		</html>
	);
}
