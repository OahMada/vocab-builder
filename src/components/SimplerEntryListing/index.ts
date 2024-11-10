'use client';

import dynamic from 'next/dynamic';

let SimplerEntryListing = dynamic(() => import('./SimplerEntryListing'));
export default SimplerEntryListing;
