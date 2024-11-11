'use client';

import dynamic from 'next/dynamic';

var PopoverRoot = dynamic(() => import('./PopOver').then((mod) => mod.PopoverRoot));
var PopoverTrigger = dynamic(() => import('./PopOver').then((mod) => mod.PopoverTrigger));
var PopoverContent = dynamic(() => import('./PopOver').then((mod) => mod.PopoverContent));

export { PopoverContent, PopoverRoot, PopoverTrigger };
