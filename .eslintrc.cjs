module.exports = {
  root: true,
  env: { browser: true, es2020: true , node :true},
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ], 
    "no-unused-vars": 1,  //사용되지 않는 값을 오류가 아닌 경고 표시로 하고 싶을때  //0은 오류, 경고 띄우지 않기, 1은 경고로, 2는 오류로 띄우기
    "no-empty": 0,    //함수에 값 없을때 아예 오류, 경고문 띄우지 않기!!!!!!
    "react/prop-types":1 //내가함
  },
}
