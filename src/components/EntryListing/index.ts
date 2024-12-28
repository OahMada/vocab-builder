'use client';

import dynamic from 'next/dynamic';

let EntryListing = dynamic(() => import('./EntryListing'));
let EntryListingFallBack = dynamic(() => import('./EntryListing').then((mod) => mod.EntryListingFallBack));
export default EntryListing;
export { EntryListingFallBack };
