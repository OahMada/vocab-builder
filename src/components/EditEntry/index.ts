'use client';

import dynamic from 'next/dynamic';

let EditEntry = dynamic(() => import('./EditEntry'));
export default EditEntry;
