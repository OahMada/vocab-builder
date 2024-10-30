import * as React from 'react';
import parse from 'html-react-parser';
import * as Accordion from '@radix-ui/react-accordion';

import { VocabEntry } from '@/types';
import { VocabEntryIdSchema } from '@/lib/dataValidation';
import { constructZodErrorMessage } from '@/helpers';
import { deleteVocabEntry } from '@/actions';

import Toast from '@/components/Toast';
import DeleteEntry from '@/components/DeleteEntry';
import { OPTIMISTIC_ENTRY_ID } from '@/constants';

type TriggerElement = React.ElementRef<typeof Accordion.Trigger>;
interface TriggerProps extends React.ComponentPropsWithoutRef<typeof Accordion.Trigger> {
	// className: string;
	children: React.ReactNode;
}

type ContentElement = React.ElementRef<typeof Accordion.Content>;
interface ContentProps extends React.ComponentPropsWithoutRef<typeof Accordion.Content> {
	// className: string;
	children: React.ReactNode;
}

function Entry({
	entry,
	index,
	optimisticallyDeleteVocabEntry,
}: {
	entry: VocabEntry;
	index: number;
	optimisticallyDeleteVocabEntry: (action: string) => void;
}) {
	let { note, sentencePlusPhoneticSymbols, translation, id } = entry;
	let html = parse(`${sentencePlusPhoneticSymbols}`);
	let [error, setError] = React.useState('');

	async function handleDeleteEntry() {
		let result = VocabEntryIdSchema.safeParse(id);
		if (result.error) {
			let errorMessage = constructZodErrorMessage(result.error);
			setError(errorMessage);
			return;
		} else {
			let id = result.data;
			React.startTransition(() => {
				optimisticallyDeleteVocabEntry(id);
			});

			let response = await deleteVocabEntry.bind(null, id)();

			if (response?.errorMessage) {
				setError(response.errorMessage);
			}
		}
	}

	return (
		<>
			<Accordion.Item value={`item-${index + 1}`}>
				<AccordionTrigger>{html}</AccordionTrigger>
				<AccordionContent>
					<div>
						<h2>Translation: </h2>
						<p>{translation}</p>
					</div>
					{note && (
						<div>
							<h2>Note: </h2>
							<p>{note}</p>
						</div>
					)}
					<div>
						<button>Edit</button>
						<DeleteEntry handleDeleteEntry={handleDeleteEntry}>
							<button disabled={id === OPTIMISTIC_ENTRY_ID}>Delete</button>
						</DeleteEntry>
					</div>
				</AccordionContent>
			</Accordion.Item>
			{error && <Toast toastType='error' content={error} />}
		</>
	);
}

export default Entry;

var AccordionTrigger = React.forwardRef<TriggerElement, TriggerProps>(({ children, ...props }, forwardedRef) => (
	<Accordion.Header>
		<Accordion.Trigger {...props} ref={forwardedRef}>
			{children}
		</Accordion.Trigger>
	</Accordion.Header>
));
AccordionTrigger.displayName = 'AccordionTrigger';

var AccordionContent = React.forwardRef<ContentElement, ContentProps>(({ children, ...props }, forwardedRef) => (
	<Accordion.Content {...props} ref={forwardedRef}>
		<div>{children}</div>
	</Accordion.Content>
));

AccordionContent.displayName = 'AccordionContent';
