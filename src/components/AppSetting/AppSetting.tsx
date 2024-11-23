import * as React from 'react';
import StyledSection from './styledSection';
import { auth, signOut } from '@/auth';

async function AppSetting() {
	let session = await auth();
	console.log('App Setting', session?.user);

	return (
		<StyledSection>
			<h2>Hello, {session?.user?.name}</h2>
			<form
				action={async () => {
					'use server';
					await signOut();
				}}
			>
				<button type='button'>Edit Info</button>
				<button type='submit'>Logout</button>
			</form>
		</StyledSection>
	);
}

export default AppSetting;
