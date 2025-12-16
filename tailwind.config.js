/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'pastel-yellow': '#FDEEAB', // Approximate from image
                'soft-beige': '#DEA058',    // Approximate from sand
                'soft-orange': '#F59E0B',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
