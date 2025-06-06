const commitlintConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-case": [2, "always", "kebab-case"],
  },
};

export default commitlintConfig;
