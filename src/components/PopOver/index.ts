'use client';

import dynamic from 'next/dynamic';

let Popover = dynamic(() => import('./PopOver'));
export default Popover;
