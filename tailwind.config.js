/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/**/*.jsx',
        './resources/**/*.ts',
        './resources/**/*.tsx',
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    ],

    theme: { extend: {} },
    plugins: [require('daisyui')],
    daisyui: {
        themes: ['light', 'dark', 'cupcake'],
        darkTheme: 'dark',
        base: true,
        styled: true,
        utils: true,
        logs: false,
        themeRoot: ':root',
    },
};
