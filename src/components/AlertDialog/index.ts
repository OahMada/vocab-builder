'use client';

import dynamic from 'next/dynamic';

var AlertDialogRoot = dynamic(() => import('./AlertDialog').then((mod) => mod.AlertDialogRoot));
var AlertDialogTrigger = dynamic(() => import('./AlertDialog').then((mod) => mod.AlertDialogTrigger));
var AlertDialogContent = dynamic(() => import('./AlertDialog').then((mod) => mod.AlertDialogContent));
var AlertDialogCancel = dynamic(() => import('./AlertDialog').then((mod) => mod.AlertDialogCancel));
var AlertDialogAction = dynamic(() => import('./AlertDialog').then((mod) => mod.AlertDialogAction));

export { AlertDialogRoot, AlertDialogAction, AlertDialogTrigger, AlertDialogCancel, AlertDialogContent };
