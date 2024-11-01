import * as React from 'react';
import EntryListing from '@/components/EntryListing';

export default function VocabListing() {
	return <EntryListing vocab={[{ id: 'i', note: '', sentencePlusPhoneticSymbols: 'hello', translation: 'there' }]} />;
}
