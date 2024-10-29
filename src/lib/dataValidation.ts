import { z } from 'zod';

export var UserInputSchema = z.string().trim().max(500, {
	message: 'The sentence you input should be no longer than 500 characters.',
});

export var PhoneticSymbolSchema = z.string().trim().max(45, {
	message: 'The word passed is too long to be seen as a valid word.',
});

export var CreateVocabEntryInputSchema = z.object({
	sentence: z.string(),
	sentencePlusPhoneticSymbols: z.string(),
	translation: z.string().min(1, { message: 'Please provide the translation text.' }),
	note: z
		.string()
		.max(1000, {
			message: 'Please keep the note shorter than 1,000 characters',
		})
		.optional(),
	userEmail: z.string().email().min(5),
});

export var VocabEntryIdSchema = z.string().trim();

// type Inferred = z.infer<typeof CreateVocabEntryInputSchema>;
