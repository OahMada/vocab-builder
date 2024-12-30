'use client';

import dynamic from 'next/dynamic';

var DropdownMenuItem = dynamic(() => import('./Dropdown').then((mod) => mod.DropdownMenuItem));
var DropdownMenuTrigger = dynamic(() => import('./Dropdown').then((mod) => mod.DropdownMenuTrigger));
var DropdownRoot = dynamic(() => import('./Dropdown').then((mod) => mod.DropdownRoot));
var DropdownMenuContent = dynamic(() => import('./Dropdown'));

export { DropdownMenuItem, DropdownMenuTrigger, DropdownRoot };
export default DropdownMenuContent;
