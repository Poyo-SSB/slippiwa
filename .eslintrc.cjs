module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	plugins: ['svelte3', '@typescript-eslint'],
	ignorePatterns: ['*.cjs'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
	settings: {
		'svelte3/typescript': () => require('typescript')
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
		"brace-style": ["off"],
		"@typescript-eslint/brace-style": ["error", "1tbs", { "allowSingleLine": true }],
		"comma-dangle": ["off"],
		"@typescript-eslint/comma-dangle": ["error", "never"],
		"comma-dangle": "off",
		"@typescript-eslint/comma-spacing": ["error", { "before": false, "after": true }],
		"@typescript-eslint/explicit-member-accessibility": ["error"],
		"func-call-spacing": ["off"],
		"@typescript-eslint/func-call-spacing": ["error"],
		"indent": ["off"],
		// "@typescript-eslint/indent": ["error", 4],
		"keyword-spacing": ["off"],
		"@typescript-eslint/keyword-spacing": ["error"],
		"@typescript-eslint/member-delimiter-style": ["error", { "singleline": { "delimiter": "comma" } }],
		"@typescript-eslint/method-signature-style": ["error"],
		"@typescript-eslint/no-base-to-string": ["error"],
		"@typescript-eslint/no-confusing-non-null-assertion": ["error"],
		"no-dupe-class-members": ["off"],
		"@typescript-eslint/no-dupe-class-members": ["error"],
		"no-duplicate-imports": ["off"],
		"@typescript-eslint/no-duplicate-imports": ["error"],
		"@typescript-eslint/no-explicit-any": ["off"],
		"@typescript-eslint/no-extra-non-null-assertion": ["error"],
		"no-extra-semi": ["off"],
		"@typescript-eslint/no-extra-semi": ["error"],
		"@typescript-eslint/no-inferrable-types": ["off"],
		"no-invalid-this": ["off"],
		"@typescript-eslint/no-invalid-this": ["error"],
		"no-loss-of-precision": "off",
		"@typescript-eslint/no-loss-of-precision": ["warn"],
		"@typescript-eslint/no-misused-new": ["error"],
		"@typescript-eslint/no-require-imports": ["error"],
		"@typescript-eslint/no-this-alias": ["error"],
		"@typescript-eslint/no-throw-literal": ["error"],
		"@typescript-eslint/no-unnecessary-boolean-literal-compare": ["error"],
		"@typescript-eslint/no-unnecessary-type-arguments": ["error"],
		"@typescript-eslint/no-unnecessary-type-assertion": ["error"],
		"@typescript-eslint/no-unnecessary-type-constraint": ["error"],
		"@typescript-eslint/no-unnecessary-type-constraint": ["error"],
		"no-unused-vars": "off",
		"@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
		"no-unreachable": ["error"],
		"@typescript-eslint/no-var-requires": ["error"],
		"object-curly-spacing": "off",
		"@typescript-eslint/object-curly-spacing": ["error", "always"],
		"@typescript-eslint/prefer-as-const": ["error"],
		"prefer-const": ["error", { "destructuring": "all" }],
		"@typescript-eslint/prefer-for-of": ["error"],
		"@typescript-eslint/prefer-nullish-coalescing": ["error"],
		"@typescript-eslint/prefer-optional-chain": ["error"],
		"@typescript-eslint/prefer-string-starts-ends-with": ["error"],
		"quotes": "off",
		"@typescript-eslint/quotes": ["error"],
		"@typescript-eslint/require-array-sort-compare": ["error"],
		"semi": "off",
		"@typescript-eslint/semi": ["error"],
		"space-before-function-paren": "off",
		"@typescript-eslint/space-before-function-paren": ["error", { "anonymous": "always", "named": "never", "asyncArrow": "always" }],
		"space-infix-ops": "off",
		"@typescript-eslint/space-infix-ops": ["error"],
		"@typescript-eslint/type-annotation-spacing": ["error"],
	}
};
