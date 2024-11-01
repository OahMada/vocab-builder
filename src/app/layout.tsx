import type { Metadata } from 'next';

import { SITE_TITLE, SITE_DESC } from '@/constants';

import './globals.css';

import StyledComponentsRegistry from '@/lib/StyledComponentsRegistry';
import ToastProvider from '@/components/ToastProvider';
import MainContentWrapper from '@/components/MainContentWrapper';
import Info from '@/components/Info';
import AppSetting from '@/components/AppSetting';
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
						<MainContentWrapper>
							<Info>
								<AppSetting />
								<Footer />
							</Info>
							{children}
						</MainContentWrapper>
					</ToastProvider>
				</StyledComponentsRegistry>
			</body>
		</html>
	);
}
