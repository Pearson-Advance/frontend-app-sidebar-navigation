const { createConfig } = require('@edx/frontend-build');

module.exports = createConfig('eslint', {
    'rules': {
        'import/prefer-default-export': 'off',
        'import/no-unresolved': 'off',
    },
    'settings': {
        'import/resolver': {
            'node': {
                'paths': ['src'],
            },
        },
    },
});
