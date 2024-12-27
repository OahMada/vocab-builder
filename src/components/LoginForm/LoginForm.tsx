'use client';

import * as React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

import { SigninFormSchema, SigninFormSchemaType } from '@/lib/dataValidation';
import { credentialsLogin, type CredentialsSigninReturnType } from '@/actions';
import { useErrorMessageContext } from '@/components/ErrorMessageProvider';
import InputEntry from '@/components/InputEntry';
import Button from '@/components/Button';
import StyledForm from '@/components/StyledForm';
import FormSubmittingError from '@/components/FormSubmittingError';

function LoginForm() {
	let {
		register,
		handleSubmit,
		formState: { errors },
		clearErrors,
	} = useForm<SigninFormSchemaType>({
		resolver: zodResolver(SigninFormSchema),
	});

	let router = useRouter();
	let searchParams = useSearchParams();
	let [isPending, startTransition] = React.useTransition();

	let callbackUrl = searchParams.get('callbackUrl');
	let { updateError } = useErrorMessageContext();

	let onSubmit: SubmitHandler<SigninFormSchemaType> = async (data) => {
		updateError('');
		let promise: CredentialsSigninReturnType;

		startTransition(() => {
			promise = credentialsLogin(data);
		});

		let response = await promise!;

		if (response) {
			updateError(response.errorMessage);
			return;
		} else {
			router.push(callbackUrl ?? '/');
		}
	};
	return (
		<StyledForm onSubmit={handleSubmit(onSubmit)}>
			<div>
				<InputEntry>
					<label htmlFor='email'>Email:</label>
					<input
						id='email'
						{...register('email')}
						placeholder='email@email.com'
						onChange={() => {
							clearErrors('email');
						}}
					/>
				</InputEntry>
				{errors.email && <FormSubmittingError>{errors.email.message}</FormSubmittingError>}
			</div>
			<div>
				<InputEntry>
					<label htmlFor='password'>Password: </label>
					<input
						type='password'
						id='password'
						{...register('password')}
						placeholder='******'
						onChange={() => {
							clearErrors('password');
						}}
					/>
				</InputEntry>
				{errors.password && <FormSubmittingError>{errors.password?.message}</FormSubmittingError>}
			</div>
			<Button>{isPending ? 'Logging in...' : 'Login'}</Button>
		</StyledForm>
	);
}

export default LoginForm;
