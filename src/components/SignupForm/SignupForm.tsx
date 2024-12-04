'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { UserSchema, UserSchemaType } from '@/lib/dataValidation';
import { signup, type SignupReturnType } from '@/actions';
import { useErrorMessageContext } from '@/components/ErrorMessageProvider';

function SignupForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		clearErrors,
	} = useForm<UserSchemaType>({
		resolver: zodResolver(UserSchema),
	});

	let router = useRouter();

	let { updateError } = useErrorMessageContext();
	let [isPending, startTransition] = React.useTransition();

	const onSubmit: SubmitHandler<UserSchemaType> = async (data) => {
		updateError('');
		let promise: SignupReturnType;

		startTransition(() => {
			promise = signup(data);
		});

		let response = await promise!;

		if ('errorMessage' in response) {
			updateError(response.errorMessage);
			return;
		}

		router.replace('/');
		// TODO replace this with a delayed redirect
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
			<button>{isPending ? 'Signing Up...' : 'Sign Up'}</button>
		</form>
	);
}

export default SignupForm;
