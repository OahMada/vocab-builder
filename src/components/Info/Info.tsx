import * as React from 'react';

import { auth } from '@/auth';

import AppSetting from '@/components/AppSetting';
import Footer from '@/components/Footer';
import ErrorMessageProvider from '@/components/ErrorMessageProvider';
import StyledSection from './StyledSection';
import SettingForm from '@/components/SettingForm';

async function Info() {
	let session = await auth();

	return (
		<StyledSection>
			<div>
				<h1>Vocab Build</h1>
				<p>Build your vocabulary with ease.</p>
			</div>
			<ErrorMessageProvider>
				<AppSetting>
					{session?.user ? (
						<>
							<h2>Hello, {session?.user?.name}</h2>
							<SettingForm />
						</>
					) : (
						<p>
							To use this app, simply input a sentence, and the Chinese translation is automatically fetched upon submission. You can then add
							phonetic symbols beside unfamiliar words and optionally add a note to the sentence. All the data will be safely saved to the database.
						</p>
					)}
				</AppSetting>
			</ErrorMessageProvider>
			<Footer />
		</StyledSection>
	);
}

export default Info;
