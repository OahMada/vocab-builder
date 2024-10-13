import * as React from 'react';
import prisma from '@/lib/db';

import { USER_EMAIL } from '@/constants';

async function EntryListing() {
	let user = await prisma.user.findUnique({
		where: {
			email: USER_EMAIL,
		},
		select: {
			name: true,
			email: true,
			vocabList: true,
		},
	});

	return (
		<section>
			{user?.vocabList.map((entry) => {
				return (
					<div key={entry.id}>
						<p>{entry.sentence}</p>
						<p>{entry.translation}</p>
					</div>
				);
			})}
		</section>
	);
}

export default EntryListing;
