module.exports = {
    root: true,
    env: {
        node: true,
    },
    globals: {
      'fiberfy.constants.BASE_URL': true,
      'fiberfy.constants.API_VERSION': true,
      'fiberfy.constants.PROJECT_DEFAULT_LATITUDE': true,
      'fiberfy.constants.PROJECT_DEFAULT_LONGITUDE': true,
      'fiberfy.constants.PROJECT_DEFAULT_ZOOM': true,
    },
    extends: ['plugin:vue/essential', 'eslint:recommended'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        semi: [2, 'always'],
        'no-unused-vars': ['error', { 'args': 'none' }]
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
};
