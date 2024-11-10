'use client';

import * as React from 'react';
import { z } from 'zod';

import { VocabEntry } from '@/types';
import { VocabEntryUpdatingDataSchema } from '@/lib/dataValidation';

type VocabEntryUpdatingData = z.infer<typeof VocabEntryUpdatingDataSchema>;

interface OptimisticVocabEntriesContextType {
	optimisticState: VocabEntry[];
	optimisticModifyState: (action: string | { id: string; translation: string; note?: string | undefined }) => void;
}

var OptimisticVocabEntriesContext = React.createContext<OptimisticVocabEntriesContextType | null>(null);

function OptimisticVocabEntriesProvider({ children, initialState }: { children: React.ReactNode; initialState: VocabEntry[] }) {
	let [optimisticState, optimisticModifyState] = React.useOptimistic(
		initialState,
		(currentState: VocabEntry[], optimisticValue: string | VocabEntryUpdatingData) => {
			if (typeof optimisticValue === 'string') {
				// to delete an entry
				return currentState.filter((vocab) => vocab.id !== optimisticValue);
			} else {
				// to update an entry
				return currentState.map((entry) => {
					if (entry.id === optimisticValue.id) {
						return { ...entry, note: optimisticValue.note ?? '', translation: optimisticValue.translation };
					} else {
						return entry;
					}
				});
			}
		}
	);

	let value = React.useMemo(() => ({ optimisticState, optimisticModifyState }), [optimisticState]);

	return <OptimisticVocabEntriesContext.Provider value={value}>{children}</OptimisticVocabEntriesContext.Provider>;
}

export function useOptimisticVocabEntriesContext() {
	let result = React.useContext(OptimisticVocabEntriesContext);

	if (!result) {
		throw new Error('useOptimisticVocabEntriesContext has to be used within <OptimisticVocabEntriesContext.Provider>.');
	}
	return result;
}

export default OptimisticVocabEntriesProvider;
