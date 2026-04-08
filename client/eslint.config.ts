import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import graphqlPlugin from '@graphql-eslint/eslint-plugin';

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
	  {
    files: ['**/*.graphql'],
    languageOptions: {
      parser: graphqlPlugin.parser,
			parserOptions: {
				schema: './src/schema.graphql'
			}
    },
    plugins: {
      '@graphql-eslint': graphqlPlugin
    },
    rules: {
      '@graphql-eslint/known-type-names': 'error'
    }
  },
	 {
   files: ['src/schema.graphql'],
   rules: graphqlPlugin.configs['flat/schema-recommended'].rules
 },
 {
   files: ['src/queries/**/*.graphql'],
   rules: graphqlPlugin.configs['flat/operations-recommended'].rules
 },
  ...tseslint.configs.recommended,
]);
