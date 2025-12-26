// import { defineConfig, globalIgnores } from 'eslint/config'
// import nextVitals from 'eslint-config-next/core-web-vitals'
// import nextTs from 'eslint-config-next/typescript'
// import prettierPlugin from 'eslint-plugin-prettier'
// import simpleImportSort from 'eslint-plugin-simple-import-sort'
// import tailwind from 'eslint-plugin-tailwindcss'

// const eslintConfig = defineConfig([
//   ...nextVitals,
//   ...nextTs,

//   {
//     plugins: {
//       prettier: prettierPlugin,
//       tailwindcss: tailwind,
//       'simple-import-sort': simpleImportSort,
//     },

//     rules: {
//       // Prettier errors in ESLint
//       'prettier/prettier': 'error',

//       // Tailwind class sorting
//       'tailwindcss/classnames-order': 'warn',

//       // Import sorting
//       'simple-import-sort/imports': 'warn',
//       'simple-import-sort/exports': 'warn',
//     },
//   },

//   // Override default ignores of eslint-config-next.
//   globalIgnores([
//     // Default ignores of eslint-config-next:
//     '.next/**',
//     'out/**',
//     'build/**',
//     'next-env.d.ts',
//   ]),
// ])

// export default eslintConfig
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettierPlugin from 'eslint-plugin-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    plugins: {
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
    },

    rules: {
      'prettier/prettier': 'error',
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },

  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])
