import * as React from 'react';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { UserInfo } from '@/types';

import UserInfoEntry from '@/components/UserInfoEntry';
import ErrorMessageProvider from '@/components/ErrorMessageProvider';
import ErrorMsg from '@/components/ErrorMsg';

export default async function SettingPage() {
	let session = await auth();
	if (!session?.user) {
		redirect('/signin?callbackUrl=/setting');
	}

	let userInfo = session.user as UserInfo;

	return (
		<ErrorMessageProvider>
			<section>
				<div>
					<h2>Edit User Info</h2>
					{userInfo.name && (
						<UserInfoEntry type='name'>
							<h3>User Name</h3>
							<p>{userInfo.name}</p>
						</UserInfoEntry>
					)}
					{userInfo.email && (
						<UserInfoEntry type='email'>
							<h3>Email</h3>
							<p>{userInfo.email}</p>
						</UserInfoEntry>
					)}
					{userInfo.password && (
						<UserInfoEntry type='password'>
							<h3>Password</h3>
							<p>*****</p>
						</UserInfoEntry>
					)}
				</div>
				<div>
					<h2>Delete User</h2>
					<button>Delete</button>
				</div>
			</section>
			<ErrorMsg />
		</ErrorMessageProvider>
	);
}