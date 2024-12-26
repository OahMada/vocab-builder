import type { Metadata } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { SessionProvider } from 'next-auth/react';

import { SITE_TITLE, SITE_DESC } from '@/constants';

import './globals.css';

import StyledComponentsRegistry from '@/lib/StyledComponentsRegistry';
import { ToastProvider } from '@/components/Toast';
import MainContentWrapper from '@/components/MainContentWrapper';
import Info from '@/components/Info';
import Footer from '@/components/Footer';

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
					<ToastProvider>
						<SessionProvider>
							<MainContentWrapper>
								<Info />
								<NuqsAdapter>{children}</NuqsAdapter>
								<Footer />
							</MainContentWrapper>
						</SessionProvider>
					</ToastProvider>
				</StyledComponentsRegistry>
			</body>
		</html>
	);
}
