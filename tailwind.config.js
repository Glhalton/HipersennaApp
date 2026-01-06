import { colors } from "./src/styles/colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Verifique se todos os seus caminhos de componentes estão aqui!
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}", // se sua pasta app estiver na raiz
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: { colors },
  },
  plugins: [],
};
