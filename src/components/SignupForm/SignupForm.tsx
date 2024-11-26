'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { SignupFormSchema, SignupFormSchemaType } from '@/lib/dataValidation';
import { signup } from '@/actions';

function SignupForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		clearErrors,
	} = useForm<SignupFormSchemaType>({
		resolver: zodResolver(SignupFormSchema),
	});

	let router = useRouter();

	const onSubmit: SubmitHandler<SignupFormSchemaType> = async (data) => {
		let response = await signup(data);

		if ('errorMessage' in response) {
			console.log(response.errorMessage);
			return;
		}

		router.replace('/');
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div>
				<label htmlFor='name'>Name:</label>
				<input id='name' {...register('name')} onChange={() => clearErrors('name')} />
				{errors.name && <p>{errors.name.message}</p>}
			</div>
			<div>
				<label htmlFor='email'>Email:</label>
				<input id='email' {...register('email')} onChange={() => clearErrors('email')} />
				{errors.email && <p>{errors.email.message}</p>}
			</div>
			<div>
				<label htmlFor='password'>Password: </label>
				<input type='password' id='password' {...register('password')} onChange={() => clearErrors('password')} />
				{errors.password && <p>{errors.password.message}</p>}
			</div>
			<button>Submit</button>
		</form>
	);
}

export default SignupForm;
