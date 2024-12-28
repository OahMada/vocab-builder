'use client';

import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styled from 'styled-components';

import { UpdateUserSchema, type UpdateUserSchemaType } from '@/lib/dataValidation';
import { updateUser } from '@/actions';

import EditUserInfo from '@/components/EditUserInfo';
import Button from '@/components/Button';
import InputEntry from '@/components/InputEntry';
import FormSubmittingError from '@/components/FormSubmittingError';

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
		if ('errorMessage' in response) {
			throw new Error(response.errorMessage);
		}
		updateDialogState(false);
	};

	let fieldSet: React.ReactNode;
	switch (type) {
		case 'name':
			fieldSet = (
				<>
					<InputEntry>
						<label htmlFor='name'>User Name:&nbsp;</label>
						<input
							type='text'
							id='name'
							{...register(type)}
							onChange={() => {
								clearErrors(type);
							}}
						/>
					</InputEntry>
					{errors[type] && <FormSubmittingError>{errors[type].message}</FormSubmittingError>}
				</>
			);
			break;
		case 'email':
			fieldSet = (
				<>
					<InputEntry>
						<label htmlFor='email'>New Email:&nbsp;</label>
						<input
							type='text'
							id='email'
							{...register(type)}
							onChange={() => {
								clearErrors(type);
							}}
						/>
					</InputEntry>
					{errors[type] && <FormSubmittingError>{errors[type].message}</FormSubmittingError>}
				</>
			);
			break;
		case 'password':
			fieldSet = (
				<>
					<div>
						<InputEntry>
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
						</InputEntry>
						{errors[type] && <FormSubmittingError>{errors[type].message}</FormSubmittingError>}
					</div>
					<div>
						<InputEntry>
							<label htmlFor='confirm-password'>Confirm Password:&nbsp;</label>
							<input
								type='text'
								id='confirm-password'
								{...register('confirmPassword')}
								onChange={() => {
									clearErrors('confirmPassword');
								}}
							/>
						</InputEntry>
						{errors.confirmPassword && <FormSubmittingError>{errors.confirmPassword.message}</FormSubmittingError>}
					</div>
					{errors.passConfirmResult && <FormSubmittingError>{errors.passConfirmResult.message}</FormSubmittingError>}
				</>
			);
			break;
	}

	return (
		<StyledDiv>
			{children}
			<EditUserInfo
				fieldSet={fieldSet}
				title={title}
				submitHandler={handleSubmit(onSubmit)}
				dialogOpen={dialogOpen}
				updateDialogState={updateDialogState}
			>
				<Button>Update</Button>
			</EditUserInfo>
		</StyledDiv>
	);
}

export default UserInfoEntry;

var StyledDiv = styled.div`
	display: flex;
	gap: var(--gap-small);
	width: 100%;
	align-items: center;

	p {
		flex-basis: 40%;
	}
`;
