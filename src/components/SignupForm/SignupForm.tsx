'use client';

import * as React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

import { UserSchema, UserSchemaType } from '@/lib/dataValidation';
import { signup, type SignupReturnType } from '@/actions';
import { useErrorMessageContext } from '@/components/ErrorMessageProvider';
import PageRedirect from '@/components/PageRedirect';
import Button from '@/components/Button';
import AuthWrapper from '@/components/AuthWrapper';
import InputEntry from '@/components/InputEntry';
import StyledForm from '@/components/StyledForm';
import FormSubmittingError from '@/components/FormSubmittingError';

function SignupForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		clearErrors,
	} = useForm<UserSchemaType>({
		resolver: zodResolver(UserSchema),
	});

	let { updateError } = useErrorMessageContext();
	let [isPending, startTransition] = React.useTransition();
	let [signupSuccess, setSignupSuccess] = React.useState(false);

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

		setSignupSuccess(true);
	};

	if (signupSuccess) {
		return <PageRedirect doneAction='signup' redirectPage='/login' />;
	}
	return (
		<AuthWrapper>
			<StyledForm onSubmit={handleSubmit(onSubmit)}>
				<div>
					<InputEntry>
						<label htmlFor='name'>Name:</label>
						<input id='name' {...register('name')} onChange={() => clearErrors('name')} placeholder='John Doe' />
					</InputEntry>
					{errors.name && <FormSubmittingError>{errors.name.message}</FormSubmittingError>}
				</div>
				<div>
					<InputEntry>
						<label htmlFor='email'>Email:</label>
						<input id='email' {...register('email')} onChange={() => clearErrors('email')} placeholder='email@email.com' />
					</InputEntry>
					{errors.email && <FormSubmittingError>{errors.email.message}</FormSubmittingError>}
				</div>
				<div>
					<InputEntry>
						<label htmlFor='password'>Password: </label>
						<input type='password' id='password' {...register('password')} onChange={() => clearErrors('password')} placeholder='*******' />
					</InputEntry>
					{errors.password && <FormSubmittingError>{errors.password.message}</FormSubmittingError>}
				</div>
				<Button>{isPending ? 'Signing Up...' : 'Sign Up'}</Button>
			</StyledForm>
			<div>
				<p>
					Already have an account?&nbsp;
					<Link href='/signin'>Sign In</Link>
				</p>
			</div>
		</AuthWrapper>
	);
}

export default SignupForm;
