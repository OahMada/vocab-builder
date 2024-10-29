import * as React from 'react';

interface UseLocalStoragePersistProps<T> {
	localStorageKey: string;
	valueToSave: T | null;
	defaultValue: T;
	stateSetter: (value: T) => void;
}

let map = new Map<string, any>();

function useLocalStoragePersist<T>({ localStorageKey, valueToSave, defaultValue, stateSetter }: UseLocalStoragePersistProps<T>): void {
	// run once on component mount
	React.useEffect(() => {
		let savedAppData = JSON.parse(window.localStorage.getItem('app-data') ?? '[]');
		savedAppData.map(([key, value]: [string, T]) => {
			map.set(key, value);
		});
		let savedValue = map.get(localStorageKey);
		let value = savedValue !== undefined ? savedValue : defaultValue;
		stateSetter(value);
	}, [defaultValue, localStorageKey, map, stateSetter]);

	// Run every time the state changes.
	React.useEffect(() => {
		if (typeof valueToSave === typeof defaultValue && valueToSave !== null) {
			console.log(map);
			map.set(localStorageKey, valueToSave);
			console.log(map);
			window.localStorage.setItem('app-data', JSON.stringify(Array.from(map.entries())));
		}
	}, [defaultValue, localStorageKey, map, valueToSave]);
}

export default useLocalStoragePersist;

export function deleteAppDataEntry(key: string) {
	map.delete(key);
	window.localStorage.setItem('app-data', JSON.stringify(Array.from(map.entries())));
}
