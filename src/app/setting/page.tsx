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
import StyledArticle from '@/components/StyledArticle';
import HeaderTag from '@/components/HeaderTag';
import Button from '@/components/Button';

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
			<StyledArticle>
				<div>
					<HeaderTag level={2}>Edit User Info</HeaderTag>
					{userInfo.name && (
						<>
							<HeaderTag level={3}>User Name</HeaderTag>
							<UserInfoEntry type='name'>
								<p>{userInfo.name}</p>
							</UserInfoEntry>
						</>
					)}
					{userInfo.email && (
						<>
							<HeaderTag level={3}>Email</HeaderTag>
							<UserInfoEntry type='email'>
								<p>{userInfo.email}</p>
							</UserInfoEntry>
						</>
					)}
					{userInfo.password && (
						<>
							<HeaderTag level={3}>Password</HeaderTag>
							<UserInfoEntry type='password'>
								<p>*****</p>
							</UserInfoEntry>
						</>
					)}
				</div>
				<div>
					<HeaderTag level={2}>Delete User</HeaderTag>
					<DeleteUser>
						<Button>Delete User</Button>
					</DeleteUser>
				</div>
				<div>
					<HeaderTag level={2}>Export Data</HeaderTag>
					<ExportData />
				</div>
			</StyledArticle>
			<ErrorMsg />
		</ErrorMessageProvider>
	);
}
