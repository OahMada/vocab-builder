'use client';

import * as React from 'react';
import { VocabEntry } from '@/components/Vocab/getVocabList';

interface OptimisticVocabContextType {
	optimisticVocab: VocabEntry[];
	addOptimisticVocabEntry: (value: VocabEntry) => void;
}

var OptimisticVocabContext = React.createContext<OptimisticVocabContextType | null>(null);

function OptimisticVocabProvider({ vocabList, children }: { vocabList: VocabEntry[]; children: React.ReactNode }) {
	let [optimisticVocab, addOptimisticVocabEntry] = React.useOptimistic(vocabList, (currentState: VocabEntry[], newEntry: VocabEntry) => {
		return [newEntry, ...currentState];
	});

	let value = React.useMemo(() => ({ optimisticVocab, addOptimisticVocabEntry }), [addOptimisticVocabEntry, optimisticVocab]);

	return <OptimisticVocabContext.Provider value={value}>{children}</OptimisticVocabContext.Provider>;
}

export default OptimisticVocabProvider;

export function useOptimisticVocabContext() {
	let result = React.useContext(OptimisticVocabContext);

	if (!result) {
		throw new Error('useOptimisticVocabContext has to be used within <OptimisticVocabContext.Provider>');
	}

	return result;
}
