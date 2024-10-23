'use client';

import * as React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

import { getErrorMessage } from '@/helpers';

function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
	return <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>;
}

export default ErrorBoundaryWrapper;

function ErrorFallback({ error }: FallbackProps) {
	return (
		<div>
			<p>{getErrorMessage(error)} </p>
		</div>
	);
}
