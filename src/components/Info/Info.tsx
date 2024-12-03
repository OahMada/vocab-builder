import * as React from 'react';

import { auth } from '@/auth';

import UserInfo from '@/components/UserInfo';
import Footer from '@/components/Footer';
import ErrorMessageProvider from '@/components/ErrorMessageProvider';
import StyledSection from './StyledSection';
import UserInfoForm from '@/components/UserInfoForm';

async function Info() {
	let session = await auth();

	return (
		<StyledSection>
			<div>
				<h1>Vocab Build</h1>
				<p>Build your vocabulary with ease.</p>
			</div>
			<ErrorMessageProvider>
				<UserInfo isAuthenticated={!!session?.user}>
					{session?.user ? (
						<>
							<h2>Hello, {session?.user?.name}</h2>
							<UserInfoForm />
						</>
					) : (
						<p>
							To use this app, simply input a sentence, and the Chinese translation is automatically fetched upon submission. You can then add
							phonetic symbols beside unfamiliar words and optionally add a note to the sentence. All the data will be safely saved to the database.
						</p>
					)}
				</UserInfo>
			</ErrorMessageProvider>
			<Footer />
		</StyledSection>
	);
}

export default Info;
