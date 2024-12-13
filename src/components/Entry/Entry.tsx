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
import ButtonGroup from '@/components/ButtonGroup';
import Button from '@/components/Button';
import HeaderTag from '@/components/HeaderTag';

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
			<AccordionTrigger asChild={true}>{html}</AccordionTrigger>
			<AccordionContent>
				<div>
					{note && <HeaderTag level={4}>Translation: </HeaderTag>}
					<p>{translation}</p>
				</div>
				{note && (
					<div>
						<HeaderTag level={4}>Note: </HeaderTag>
						<p>{note}</p>
					</div>
				)}
				<ButtonGroup>
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
						<Button>Edit</Button>
					</EditEntry>
					<DeleteEntry handleDeleteEntry={handleDeleteEntry}>
						<Button>Delete</Button>
					</DeleteEntry>
				</ButtonGroup>
			</AccordionContent>
		</AccordionItem>
	);
}

export default Entry;
