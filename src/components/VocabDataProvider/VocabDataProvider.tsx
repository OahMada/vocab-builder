'use client';

import { VocabEntry } from '@/types';
import { produce } from 'immer';
import * as React from 'react';

type ActionType = { type: 'add'; payload: VocabEntry[] } | { type: 'update'; payload: VocabEntry } | { type: 'delete'; payload: string };

interface VocabDataContextType {
	state: VocabEntry[];
	dispatch: React.Dispatch<ActionType>;
}

var VocabDataContext = React.createContext<VocabDataContextType | null>(null);

function reducer(state: VocabEntry[], action: ActionType) {
	return produce(state, (draftState) => {
		switch (action.type) {
			case 'add':
				return [...draftState, ...action.payload];
			case 'update':
				return draftState.map((item) => {
					if (item.id === action.payload.id) {
						return action.payload;
					}
					return item;
				});
			case 'delete':
				return draftState.filter((item) => item.id !== action.payload);

			default:
				throw new Error(`No action matches the specified action type.`);
		}
	});
}

function VocabDataProvider({ children, initialState }: { children: React.ReactNode; initialState: VocabEntry[] }) {
	let [state, dispatch] = React.useReducer(reducer, initialState);

	let value = React.useMemo(() => ({ state, dispatch }), [state]);

	return <VocabDataContext.Provider value={value}>{children}</VocabDataContext.Provider>;
}

export function useVocabDataProvider() {
	let result = React.useContext(VocabDataContext);

	if (!result) {
		// the function is called outside of VocabDataProvider
		return;
	}
	return result;
}

export default VocabDataProvider;
