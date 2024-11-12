import * as React from 'react';

type Keys = 'Enter' | ['Shift', 'Enter'];

type KeyPressed = Record<string, boolean>;

function useKeyboard(key: Keys) {
	let [isKeyPressed, setIsKeyPressed] = React.useState(false);

	React.useEffect(() => {
		let keysPressed: KeyPressed = {};

		function handleKeyDown(event: KeyboardEvent) {
			if (typeof key === 'string') {
				if (event.key === key) setIsKeyPressed(true);
			} else {
				// https://medium.com/@javaidea/element-implicitly-has-an-any-type-because-expression-of-type-string-can-t-be-used-to-index-a7c1c189a827
				keysPressed[event.key] = true;
				if (keysPressed[key[0]] && event.key === key[1]) {
					setIsKeyPressed(true);
				}
			}
		}

		function handleKeyUp(event: KeyboardEvent) {
			if (typeof key === 'string') {
				if (event.key === key) setIsKeyPressed(false);
			} else {
				delete keysPressed[event.key];
				if (event.key === key[0] || event.key === key[1]) {
					setIsKeyPressed(false);
				}
			}
		}
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [key]);

	return isKeyPressed;
}

export default useKeyboard;
