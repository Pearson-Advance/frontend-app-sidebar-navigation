const { createConfig } = require('@edx/frontend-build');

module.exports = createConfig('eslint', {
    'rules': {
        'react/function-component-definition': 'off',
        'import/no-extraneous-dependencies': 'off',
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
