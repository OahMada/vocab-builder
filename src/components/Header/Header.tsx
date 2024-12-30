import * as React from 'react';

import { auth } from '@/auth';

import StyledDiv from './StyledDiv';

import HeaderTag from '@/components/HeaderTag';
import HeaderMenu from '@/components/HeaderMenu';

async function Header() {
	let session = await auth();

	return (
		<StyledDiv>
			<HeaderTag level={2}>Vocab Builder</HeaderTag>
			{session?.user && (
				<div className='dropdown'>
					<span>{session.user?.name}</span>
					<HeaderMenu />
				</div>
			)}
		</StyledDiv>
	);
}

export default Header;
