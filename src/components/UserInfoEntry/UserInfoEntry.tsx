'use client';

import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { UpdateUserSchema, type UpdateUserSchemaType } from '@/lib/dataValidation';
import { updateUser } from '@/actions';

import EditUserInfo from '@/components/EditUserInfo';

type UserInfoEditTitleMapKeys = keyof typeof UserInfoEditTitleMap;
type SubmittingData = { [key in UserInfoEditTitleMapKeys]?: string };
// https://github.com/orgs/react-hook-form/discussions/7111#discussioncomment-8359671
type FormData = UpdateUserSchemaType & { passConfirmResult: string };

const UserInfoEditTitleMap = {
	name: 'Update Name',
	email: 'Update Email',
	password: 'Update Password',
};

function UserInfoEntry({ children, type }: { children: React.ReactNode; type: keyof typeof UserInfoEditTitleMap }) {
	let title: string = UserInfoEditTitleMap[type];
	let newPasswordInputRef = React.useRef<null | HTMLInputElement>(null);
	let [dialogOpen, setDialogOpen] = React.useState<boolean>(false);

	let updateDialogState = React.useCallback(function (value: boolean) {
		setDialogOpen(value);
	}, []);

	let {
		register,
		handleSubmit,
		formState: { errors },
		clearErrors,
	} = useForm<FormData>({
		resolver: zodResolver(UpdateUserSchema),
	});

	let { ref, ...rest } = register('password');
	React.useImperativeHandle(ref, () => newPasswordInputRef.current);

	let onSubmit: SubmitHandler<UpdateUserSchemaType> = async function (data) {
		let submittingData: SubmittingData = {};
		if (data.name) {
			submittingData.name = data.name;
		} else if (data.email) {
			submittingData.email = data.email;
		} else if (data.password) {
			submittingData.password = data.password;
		}
		let response = await updateUser(submittingData);
		if (response && 'errorMessage' in response) {
			throw new Error(response.errorMessage);
		}
		updateDialogState(false);
	};

	let fieldSet: React.ReactNode;
	switch (type) {
		case 'name':
			fieldSet = (
				<>
					<label htmlFor='name'>User Name:&nbsp;</label>
					<input
						type='text'
						id='name'
						{...register(type)}
						onChange={() => {
							clearErrors(type);
						}}
					/>
					{errors[type] && <p>{errors[type].message}</p>}
				</>
			);
			break;
		case 'email':
			fieldSet = (
				<>
					<label htmlFor='email'>New Email:&nbsp;</label>
					<input
						type='text'
						id='email'
						{...register(type)}
						onChange={() => {
							clearErrors(type);
						}}
					/>
					{errors[type] && <p>{errors[type].message}</p>}
				</>
			);
			break;
		case 'password':
			fieldSet = (
				<>
					<div>
						<label htmlFor='password'>New Password:&nbsp;</label>
						<input
							type='text'
							id='password'
							{...rest}
							onChange={() => {
								clearErrors(type);
							}}
							ref={newPasswordInputRef}
						/>
						{errors[type] && <p>{errors[type].message}</p>}
					</div>
					<div>
						<label htmlFor='confirm-password'>Confirm New Password:&nbsp;</label>
						<input
							type='text'
							id='confirm-password'
							{...register('confirmPassword')}
							onChange={() => {
								clearErrors('confirmPassword');
							}}
						/>
						{errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
					</div>
					{errors.passConfirmResult && <p>{errors.passConfirmResult.message}</p>}
				</>
			);
			break;
	}

	return (
		<div>
			{children}
			<EditUserInfo
				fieldSet={fieldSet}
				title={title}
				submitHandler={handleSubmit(onSubmit)}
				dialogOpen={dialogOpen}
				updateDialogState={updateDialogState}
			>
				<button>Update</button>
			</EditUserInfo>
		</div>
	);
}

export default UserInfoEntry;
