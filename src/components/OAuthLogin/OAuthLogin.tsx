import * as React from 'react';
import { socialLogin } from '@/actions';

function OAuthLogin() {
	return (
		<form action={socialLogin}>
			<button name='action' value='google'>
				Login with Google
			</button>
			<button name='action' value='github'>
				Login with Github
			</button>
		</form>
	);
}

export default OAuthLogin;
