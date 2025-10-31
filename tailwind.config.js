// tailwind.config.js
const {heroui} = require('@heroui/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [

    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    
    // ...
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontSize: {
        '5xl': ['84px', { lineHeight: '1.4' }], 
        '4xl': ['64px', { lineHeight: '1.4' }], 
        '3xl': ['56px', { lineHeight: '1.4' }], 
        '2xl': ['47px', { lineHeight: '1.4' }], 
        'xl': ['36px', { lineHeight: '1.4' }], 
        'lg': ['27px', { lineHeight: '1.4' }], 
        'md': ['24px', { lineHeight: '1.4' }], 
        'base': ['18px', { lineHeight: '1.4' }],
        'sm': ['16px', { lineHeight: '1.4' }], 
        'xs': ['14px', { lineHeight: '1.4' }], 
        '2xs': ['12px', { lineHeight: '1.4' }], 
      },
      screens: {
        'c1920': '1920px',
        'c1700': '1700px',
        'c1480': '1480px',
        'c1200': '1200px',
        'c992': '992px',
        'c768': '768px',
        'c250': '250px',
        // => @media (min-width: XXXpx) { ... }
      },
      fontFamily: {
        'prompt-li': 'Prompt-Light',
        'prompt-reg': 'Prompt-Regular',
        'prompt-med': 'Prompt-Medium',
        'prompt-sb': 'Prompt-SemiBold',
        'prompt-bd': 'Prompt-Bold',
      },
    },
  },
  plugins: [heroui()],
};