'use client';

import dynamic from 'next/dynamic';

var DialogContent = dynamic(() => import('./Dialog').then((mod) => mod.DialogContent));
var DialogTrigger = dynamic(() => import('./Dialog').then((mod) => mod.DialogTrigger));
var DialogRoot = dynamic(() => import('./Dialog').then((mod) => mod.DialogRoot));

export { DialogContent, DialogTrigger, DialogRoot };
