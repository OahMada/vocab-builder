import * as React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { UserInfo } from '@/types';

import UserInfoEntry from '@/components/UserInfoEntry';
import ErrorMessageProvider from '@/components/ErrorMessageProvider';
import ErrorMsg from '@/components/ErrorMsg';
import DeleteUser from '@/components/DeleteUser';
import ExportData from '@/components/ExportData';

export const metadata: Metadata = {
	title: 'Setting / Vocab Builder',
	description: 'Change user settings.',
};

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
					<DeleteUser>
						<button>Delete User</button>
					</DeleteUser>
				</div>
				<div>
					<h2>Export Data</h2>
					<ExportData />
				</div>
			</section>
			<ErrorMsg />
		</ErrorMessageProvider>
	);
}
