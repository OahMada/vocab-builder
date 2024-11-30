'use client';

import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { UpdateUserSchema, type UpdateUserSchemaType } from '@/lib/dataValidation';
import { updateUser } from '@/actions';

import EditUserInfo from '@/components/EditUserInfo';

type UserInfoEditTitleMapKeys = keyof typeof UserInfoEditTitleMap;
type SubmittingData = { [key in UserInfoEditTitleMapKeys]?: string };

const UserInfoEditTitleMap = {
	name: 'Update Name',
	email: 'Update Email',
	password: 'Update Password',
};

function UserInfoEntry({ children, type }: { children: React.ReactNode; type: keyof typeof UserInfoEditTitleMap }) {
	let title: string = UserInfoEditTitleMap[type];
	let newPasswordInputRef = React.useRef<null | HTMLInputElement>(null);

	let {
		register,
		handleSubmit,
		formState: { errors },
		clearErrors,
	} = useForm<UpdateUserSchemaType>({
		resolver: zodResolver(UpdateUserSchema),
	});

	// TODO A way to show the password mismatch error and prevent the dialog from closing when Zod validation fails.

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
					{errors.root}
				</>
			);
			break;
	}

	return (
		<div>
			{children}
			<EditUserInfo fieldSet={fieldSet} title={title} submitHandler={handleSubmit(onSubmit)}>
				<button>Update</button>
			</EditUserInfo>
		</div>
	);
}

export default UserInfoEntry;
