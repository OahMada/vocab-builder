import type { Metadata } from 'next';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_TITLE, SITE_DESC } from '@/constants';

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
				<Header />
				<main>{children}</main>
				<Footer />
			</body>
		</html>
	);
}
