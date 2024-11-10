// https://eslint.org/docs/latest/use/configure/migration-guide
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

let config = [
	...compat.extends('next/core-web-vitals', 'next/typescript'),
	{
		rules: {
			'no-var': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
			'prefer-const': 'off',
		},
	},
];

export default config;
