import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    plugins: {
      prettier: prettierPlugin,
      tailwindcss: tailwind,
      "simple-import-sort": simpleImportSort,
    },

    rules: {
      // Prettier errors in ESLint
      "prettier/prettier": "error",

      // Tailwind class sorting
      "tailwindcss/classnames-order": "warn",

      // Import sorting
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
    },
  },
  
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
