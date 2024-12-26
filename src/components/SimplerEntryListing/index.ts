'use client';

import dynamic from 'next/dynamic';

let SimplerEntryListing = dynamic(() => import('./SimplerEntryListing'));
var SimplerEntryListingFallback = dynamic(() => import('./SimplerEntryListing').then((mod) => mod.SimplerEntryListingFallBack));

export default SimplerEntryListing;
export { SimplerEntryListingFallback };
