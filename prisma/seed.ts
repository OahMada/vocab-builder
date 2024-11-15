import { PrismaClient, Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';

var vocabEntries: Prisma.VocabEntryCreateInput[] = [];
let uniqueSentences = faker.helpers.uniqueArray(faker.lorem.sentence, 50);

for (let index = 0; index < uniqueSentences.length; index++) {
	vocabEntries.push({
		sentence: uniqueSentences[index],
		sentencePlusPhoneticSymbols: uniqueSentences[index],
		translation: `这是测试翻译${index}`,
		note: faker.lorem.sentences(),
		user: {
			connect: {
				email: 'adam@gmail.com',
			},
		},
	});
}

const prisma = new PrismaClient();

async function main() {
	console.log('Start seeding ...');
	for (const vocabEntry of vocabEntries) {
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
