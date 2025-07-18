import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // 사용하지 않는 변수 관련 규칙 완화
      "@typescript-eslint/no-unused-vars": [
        "warn", // error에서 warn으로 변경
        {
          argsIgnorePattern: "^_", // _로 시작하는 매개변수는 무시
          varsIgnorePattern: "^_", // _로 시작하는 변수는 무시
          ignoreRestSiblings: true, // 구조분해에서 나머지는 무시
        },
      ],
      "no-unused-vars": "off", // 기본 규칙 비활성화 (TypeScript 규칙 사용)
    },
  },
]);
