import * as React from 'react';

interface UseLocalStoragePersistProps<T> {
	localStorageKey: string;
	valueToSave: T | null;
	defaultValue: T;
	stateSetter?: (value: T) => void;
	stateUpdater?: (jsonData: string | null) => void;
}

function useLocalStoragePersist<T>({ localStorageKey, valueToSave, defaultValue, stateSetter, stateUpdater }: UseLocalStoragePersistProps<T>): void {
	// run once on component mount
	React.useEffect(() => {
		let savedValue = window.localStorage.getItem(localStorageKey);
		if (stateSetter) {
			let value = savedValue ? (typeof defaultValue === 'string' ? savedValue : JSON.parse(savedValue)) : defaultValue; // Strangely I can't use Boolean(savedValue) here
			stateSetter(value);
		} else if (stateUpdater) {
			stateUpdater(savedValue);
		}
	}, [defaultValue, localStorageKey, stateSetter, stateUpdater]);

	// Run every time the state changes.
	React.useEffect(() => {
		let value = typeof valueToSave === 'string' ? valueToSave : JSON.stringify(valueToSave);
		if (typeof valueToSave === typeof defaultValue && valueToSave !== null) {
			window.localStorage.setItem(localStorageKey, value);
		}
	}, [defaultValue, localStorageKey, valueToSave]);
}

export default useLocalStoragePersist;
