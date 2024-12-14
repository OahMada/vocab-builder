'use client';

import dynamic from 'next/dynamic';

var Toast = dynamic(() => import('./Toast'));
var ToastProvider = dynamic(() => import('./ToastProvider'));

export { ToastProvider };
export default Toast;
