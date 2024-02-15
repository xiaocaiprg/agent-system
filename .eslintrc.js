module.exports = {
  extends: ["plugin:vue/recommended"],
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  rules: {
    "vue/multi-word-component-names": 0,
    "vue/html-self-closing": 0,
    "vue/singleline-html-element-content-newline": 0,
  },
};
