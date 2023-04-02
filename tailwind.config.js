/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme")
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
        // Or if using `src` directory:
    ],
    // important: "#__next",
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                nunito: ['"Nunito Sans"', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [],
}
