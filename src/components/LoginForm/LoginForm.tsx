'use client';

import * as React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { SigninFormSchema, SigninFormSchemaType } from '@/lib/dataValidation';
import { Login } from '@/actions';

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
	const onSubmit: SubmitHandler<SigninFormSchemaType> = async (data) => {
		let response = await Login(data);

		if (response && 'errorMessage' in response) {
			console.log(response.errorMessage);
		} else {
			router.push('/');
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
			<button>Submit</button>
		</form>
	);
}

export default LoginForm;
