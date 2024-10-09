import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'Vocab Builder',
	description: 'A tool to help build vocabulary for reciting with Anki.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body>{children}</body>
		</html>
	);
}
