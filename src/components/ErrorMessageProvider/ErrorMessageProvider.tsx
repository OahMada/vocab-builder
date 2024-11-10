'use client';

import * as React from 'react';

interface ErrorMessageContextType {
	errorMsg: string;
	updateError: (msg: string) => void;
}

var ErrorMessageContext = React.createContext<ErrorMessageContextType | null>(null);

function ErrorMessageProvider({ children }: { children: React.ReactNode }) {
	let [errorMsg, setErrorMsg] = React.useState('');
	function updateError(msg: string) {
		setErrorMsg(msg);
	}

	let value = React.useMemo(() => ({ errorMsg, updateError }), [errorMsg]);

	return <ErrorMessageContext.Provider value={value}>{children}</ErrorMessageContext.Provider>;
}

export function useErrorMessageContext() {
	let result = React.useContext(ErrorMessageContext);
	if (!result) {
		throw new Error('useErrorMessageContext has to be used within <ErrorMessageContext.Provider>');
	}
	return result;
}

export default ErrorMessageProvider;
