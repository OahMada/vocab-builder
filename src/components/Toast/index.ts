'use client';

import dynamic from 'next/dynamic';

let Toast = dynamic(() => import('./Toast'));
export default Toast;
