'use client';

import * as React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

import { SigninFormSchema, SigninFormSchemaType } from '@/lib/dataValidation';
import { credentialsLogin, type CredentialsSigninReturnType } from '@/actions';
import { useErrorMessageContext } from '@/components/ErrorMessageProvider';

function LoginForm() {
	const {
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

		if (response && 'errorMessage' in response) {
			updateError(response.errorMessage);
			return;
		} else {
			router.push(callbackUrl ?? '/');
		}
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div>
				<label htmlFor='email'>Email:</label>
				<input
					id='email'
					{...register('email')}
					placeholder='email'
					onChange={() => {
						clearErrors('email');
					}}
				/>
				{errors.email && <p>{errors.email.message}</p>}
			</div>
			<div>
				<label htmlFor='password'>Password: </label>
				<input
					type='password'
					id='password'
					{...register('password')}
					placeholder='password'
					onChange={() => {
						clearErrors('password');
					}}
				/>
				{errors.password && <p>{errors.password?.message}</p>}
			</div>
			<button>{isPending ? 'Logging in...' : 'Login'}</button>
		</form>
	);
}

export default LoginForm;
