import * as React from 'react';
import parse from 'html-react-parser';

import { VocabEntry } from '@/types';
import { VocabEntryStringSchema, VocabEntryUpdatingDataSchema } from '@/lib/dataValidation';
import { constructZodErrorMessage } from '@/helpers';
import { deleteVocabEntry, updateVocabEntry } from '@/actions';
import { RawFormData } from '@/types';

import DeleteEntry from '@/components/DeleteEntry';
import EditEntry from '@/components/EditEntry';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/Accordion';

function Entry({ entry, index }: { entry: VocabEntry; index: number }) {
	let { note, sentencePlusPhoneticSymbols, translation, id } = entry;
	let html = parse(`${sentencePlusPhoneticSymbols}`);

	async function handleDeleteEntry() {
		let result = VocabEntryStringSchema.safeParse(id);
		if (result.error) {
			let errorMessage = constructZodErrorMessage(result.error);
			return { errorMessage };
		} else {
			let id = result.data;
			let response = await deleteVocabEntry.bind(null, id)();
			return response;
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
					data: { translation, note, id, sentencePlusPhoneticSymbols },
				};
			}
			let res = await updateVocabEntry.bind(null, result.data)();
			return res;
		}
	}

	return (
		<AccordionItem value={`item-${index + 1}`}>
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
						<button>Edit</button>
					</EditEntry>
					<DeleteEntry handleDeleteEntry={handleDeleteEntry}>
						<button>Delete</button>
					</DeleteEntry>
				</div>
			</AccordionContent>
		</AccordionItem>
	);
}

export default Entry;
