import { z } from 'zod';

export var UserInputSchema = z.string().trim().max(500, {
	message: 'The sentence you input should be no longer than 500 characters.',
});

export var PhoneticSymbolSchema = z.string().trim().max(45, {
	message: 'The word passed is too long to be seen as a valid word.',
});

export var CreateVocabEntryInputSchema = z.object({
	sentence: z.string(),
	sentencePlusPhoneticSymbols: z.string().trim(),
	translation: z.string().trim().min(1, { message: 'Please provide the translation text.' }),
	note: z
		.string()
		.trim()
		.max(1000, {
			message: 'Please keep the note shorter than 1,000 characters',
		})
		.optional(),
	userEmail: z.string().email().min(5),
});

export var VocabEntryStringSchema = z.string().trim();

export var VocabEntryUpdatingDataSchema = z.object({
	id: z.string().trim(),
	translation: z.string().trim().min(1, { message: 'Please provide the translation text.' }),
	note: z
		.string()
		.trim()
		.max(1000, {
			message: 'Please keep the note shorter than 1,000 characters',
		})
		.optional(),
});

export var SignupFormSchema = z.object({
	name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }).trim(),
	email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
	password: z
		.string()
		.min(8, { message: 'Be at least 8 characters long' })
		// .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
		// .regex(/[0-9]/, { message: 'Contain at least one number.' })
		// .regex(/[^a-zA-Z0-9]/, {
		// 	message: 'Contain at least one special character.',
		// })
		.trim(),
});

export type SignupFormSchemaType = z.infer<typeof SignupFormSchema>;

export var SigninFormSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
	password: z.string().min(8, { message: 'Password must be at least 8 characters long' }).max(32, 'Password must be less than 32 characters').trim(),
});

export type SigninFormSchemaType = z.infer<typeof SigninFormSchema>;
