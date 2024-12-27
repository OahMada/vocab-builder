import * as React from 'react';

import { auth } from '@/auth';

import ErrorMessageProvider from '@/components/ErrorMessageProvider';
import StyledSection from './StyledSection';
import UserInfoForm from '@/components/UserInfoForm';
import HeaderTag from '@/components/HeaderTag';
import ErrorMsg from '@/components/ErrorMsg';

async function Info() {
	let session = await auth();

	return (
		<StyledSection>
			<div className='wrapper'>
				<div>
					<HeaderTag level={1}>Vocab Builder</HeaderTag>
					<HeaderTag level={3}>Build your vocabulary with ease.</HeaderTag>
				</div>
				<ErrorMessageProvider>
					<div className='user-info'>
						<div>
							<p>To use this app, simply input a sentence, and the Chinese translation is automatically fetched upon submission. </p>
							<p>You can then add phonetic symbols beside any unfamiliar words and optionally add a note to the sentence.</p>
							<p>All the data will be safely saved to the database.</p>
						</div>

						{session?.user && (
							<div>
								<HeaderTag level={3}>Hello, {session?.user?.name}</HeaderTag>
								<UserInfoForm isAuthenticated={!!session?.user} />
							</div>
						)}
						<ErrorMsg />
					</div>
				</ErrorMessageProvider>
			</div>
		</StyledSection>
	);
}

export default Info;
