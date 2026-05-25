/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Assuming you are using Inter or standard sans for now, but this hooks up your font-heading
        heading: ["ui-sans-serif", "system-ui", "sans-serif", "Inter"],
        sans: ["ui-sans-serif", "system-ui", "sans-serif", "Inter"],
      },
    },
  },
  plugins: [],
};
