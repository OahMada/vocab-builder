'use client';

import dynamic from 'next/dynamic';

var AccordionContent = dynamic(() => import('./Accordion').then((mod) => mod.AccordionContent));
var AccordionItem = dynamic(() => import('./Accordion').then((mod) => mod.AccordionItem));
var AccordionRoot = dynamic(() => import('./Accordion').then((mod) => mod.AccordionRoot));
var AccordionTrigger = dynamic(() => import('./Accordion').then((mod) => mod.AccordionTrigger));

export { AccordionContent, AccordionItem, AccordionTrigger, AccordionRoot };
