import * as React from 'react';
import parse from 'html-react-parser';
import * as Accordion from '@radix-ui/react-accordion';

import { VocabEntry } from '@/types';
import { OPTIMISTIC_ENTRY_ID } from '@/constants';
import { VocabEntryIdSchema, VocabEntryUpdatingData, VocabEntryUpdatingDataSchema } from '@/lib/dataValidation';
import { constructZodErrorMessage } from '@/helpers';
import { deleteVocabEntry, updateVocabEntry } from '@/actions';
import { RawFormData } from '@/types';

import DeleteEntry from '@/components/DeleteEntry';
import EditEntry from '@/components/EditEntry';

function Entry({
	entry,
	index,
	optimisticallyModifyVocabEntry,
	updateError,
}: {
	entry: VocabEntry;
	index: number;
	optimisticallyModifyVocabEntry: (action: string | VocabEntryUpdatingData) => void;
	updateError: (errMsg: string) => void;
}) {
	let { note, sentencePlusPhoneticSymbols, translation, id } = entry;
	let html = parse(`${sentencePlusPhoneticSymbols}`);

	async function handleDeleteEntry() {
		updateError(''); // So that error can keep showing up if the user repeats the same action.
		let result = VocabEntryIdSchema.safeParse(id);
		if (result.error) {
			let errorMessage = constructZodErrorMessage(result.error);
			updateError(errorMessage);
			return;
		} else {
			let id = result.data;
			React.startTransition(() => {
				optimisticallyModifyVocabEntry(id);
			});

			let response = await deleteVocabEntry.bind(null, id)();

			if (response?.errorMessage) {
				updateError(response.errorMessage);
			}
		}
	}

	async function handleEditEntry(formData: RawFormData) {
		let result = VocabEntryUpdatingDataSchema.safeParse({ ...formData, id });
		if (result.error) {
			let errorMessage = constructZodErrorMessage(result.error);
			return { errorMessage };
		} else {
			let data = result.data;
			if (data.translation === translation && data.note === note) {
				return {
					data: { translation, note },
				};
			}
			let res = await updateVocabEntry.bind(null, result.data)();

			React.startTransition(() => {
				optimisticallyModifyVocabEntry({ id, translation: data.translation, note: data.note });
			});

			return res;
		}
	}

	return (
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
					<EditEntry
						updateError={updateError}
						handleEditEntry={handleEditEntry}
						fieldSet={
							<>
								<fieldset>
									<label htmlFor='translation'>Translation</label>
									<textarea name='translation' id='translation' defaultValue={translation} />
								</fieldset>
								<fieldset>
									<label htmlFor='note'>Note</label>
									<textarea name='note' id='note' defaultValue={note} />
								</fieldset>
							</>
						}
					>
						<button disabled={id === OPTIMISTIC_ENTRY_ID}>Edit</button>
					</EditEntry>
					<DeleteEntry handleDeleteEntry={handleDeleteEntry}>
						<button disabled={id === OPTIMISTIC_ENTRY_ID}>Delete</button>
					</DeleteEntry>
				</div>
			</AccordionContent>
		</Accordion.Item>
	);
}

export default Entry;

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
