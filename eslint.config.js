import globals from "globals";

export default [
  {
    files: ["games/onslaught/src/**/*.js", "scripts/**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node, __THREE_DEVTOOLS__: "readonly" },
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "off",
    },
  },
];
