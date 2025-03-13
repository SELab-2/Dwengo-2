module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "prettier", "no-only-tests", "import"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended"
    ],
    rules: {
        "prettier/prettier": ["error", { "semi": true, "singleQuote": false, "tabWidth": 4, "printWidth": 120 }],
        "import/order": [
            "error",
            {
                "groups": ["builtin", "external", "internal"],
                "alphabetize": { "order": "asc", "caseInsensitive": true }
            }
        ],
        "no-console": "off",
        "no-only-tests/no-only-tests": "warn"
    }
};
