'use client';

import * as React from 'react';
import parse from 'html-react-parser';

import { VocabEntry } from '../Vocab/getVocabList';

function EntryListing({ optimisticVocab }: { optimisticVocab: VocabEntry[] }) {
	return (
		<section>
			{optimisticVocab.map((entry) => {
				let html = parse(`${entry.sentencePlusPhoneticSymbols}`);

				return (
					<div key={entry.id}>
						<p>{html}</p>
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
