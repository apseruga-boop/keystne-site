/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    tailwindcss: {},
    // NOTE: autoprefixer intentionally removed to avoid dependency issues in this sandbox
  },
};
