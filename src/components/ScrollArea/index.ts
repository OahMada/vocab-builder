'use client';

import dynamic from 'next/dynamic';

let ScrollArea = dynamic(() => import('./ScrollArea'));
export default ScrollArea;
