'use client';

import * as React from 'react';

import { VocabEntry } from '../Vocab/getVocabList';

function EntryListing({ optimisticVocab }: { optimisticVocab: VocabEntry[] }) {
	return (
		<section>
			{optimisticVocab.map((entry) => {
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

// function Entries({ items }: { items: VocabEntry[] }) {
// 	let itemSlice = items.slice(0, 5);
// 	return itemSlice.map((item) => {
// 		return (
// 			<div key={item.id}>
// 				<p>{item.sentence}</p>
// 				<p>{item.translation}</p>
// 			</div>
// 		);
// 	});
// }
export default EntryListing;
