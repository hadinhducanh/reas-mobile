/** @type {import('tailwindcss').Config} */
module.exports = {
  // Cập nhật đường dẫn đến tất cả các file chứa class NativeWind
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  // Sử dụng preset của NativeWind v4
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
