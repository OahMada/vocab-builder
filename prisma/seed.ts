import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

var initialVocabSheet: Prisma.VocabEntryCreateInput[] = [
	{
		sentence: 'sentence one',
		translation: '翻译一',
		user: {
			connectOrCreate: {
				where: {
					email: 'adam@gmail.com',
				},
				create: {
					email: 'adam@gmail.com',
					name: 'adam hao',
					password: '123456',
				},
			},
		},
	},
	{
		sentence: 'sentence two',
		translation: '翻译二',
		user: {
			connect: {
				email: 'adam@gmail.com',
			},
		},
	},
	{
		sentence: 'sentence three',
		translation: '翻译三',
		user: {
			connect: {
				email: 'adam@gmail.com',
			},
		},
	},
];

async function main() {
	console.log('Start seeding ...');
	for (const vocabEntry of initialVocabSheet) {
		const newEntry = await prisma.vocabEntry.create({ data: vocabEntry });
		console.log(`Created post with id: ${newEntry.id}`);
		console.log('Seeding finished.');
	}
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
