'use client';

import dynamic from 'next/dynamic';

let EntryListing = dynamic(() => import('./EntryListing'));
export default EntryListing;
