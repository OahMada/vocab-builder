'use client';

import dynamic from 'next/dynamic';

let DeleteEntry = dynamic(() => import('./DeleteEntry'));
export default DeleteEntry;
