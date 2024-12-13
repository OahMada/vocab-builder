import * as React from 'react';

import useLocalStoragePersist from '@/hooks/useLocalStoragePersist';
import ButtonGroup from '@/components/ButtonGroup';
import Button from '@/components/Button';
import TextArea from '@/components/TextArea';

interface SentenceTranslationProps {
	updateTranslation: (translation: string) => void;
	translation: string;
	retryBtn: React.ReactNode;
}

var SentenceTranslation = React.forwardRef<HTMLTextAreaElement, SentenceTranslationProps>(function SentenceTranslation(
	{ updateTranslation, translation, retryBtn },
	forwardedRef
) {
	let [editMode, setEditMode] = React.useState<boolean | null>(null);
	useLocalStoragePersist<boolean>({
		defaultValue: false,
		localStorageKey: 'translation-edit-mode',
		stateSetter: React.useCallback((value: boolean) => setEditMode(value), []),
		valueToSave: editMode,
	});

	return (
		<>
			{editMode ? (
				<>
					<TextArea
						value={translation}
						onChange={(e) => {
							updateTranslation(e.target.value);
						}}
						name='translation-text'
						ref={forwardedRef}
						rows={2}
					/>
					<ButtonGroup className='trans-btn'>
						<Button
							type='button'
							onClick={() => {
								setEditMode(false);
							}}
						>
							Done
						</Button>
					</ButtonGroup>
				</>
			) : (
				<>
					<p>{translation}</p>
					<ButtonGroup>
						{retryBtn}
						<Button
							onClick={() => {
								setEditMode(true);
							}}
						>
							Edit
						</Button>
					</ButtonGroup>
				</>
			)}
		</>
	);
});

export default SentenceTranslation;

export function TranslationFallback({ children }: { children: React.ReactNode }) {
	return (
		<>
			{children}
			<ButtonGroup>
				<Button disabled={true}>Retry</Button>
				<Button disabled={true}>Edit</Button>
			</ButtonGroup>
		</>
	);
}
