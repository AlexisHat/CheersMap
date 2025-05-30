import js from "@eslint/js";
import globals from "globals";
import jest from "eslint-plugin-jest";

export default [
  js.configs.recommended,

  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },

  {
    files: ["**/*.test.js", "**/__mocks__/**/*.js"],
    plugins: {
      jest,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {},
  },
];
