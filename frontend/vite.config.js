// import { defineConfig } from 'vite'
// import tailwindcss from '@tailwindcss/vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; 

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Integrates Tailwind CSS into the Vite build process
  ],
});
// This configuration file sets up Vite with React and Tailwind CSS support.
// It imports the necessary plugins and exports a configuration object that includes these plugins.
// The `react` plugin enables React support, while the `tailwindcss` plugin integrates Tailwind CSS into the build process.
// This setup allows for a modern development experience with fast builds and hot module replacement for React applications styled with Tailwind CSS.
// The `defineConfig` function is used to define the configuration in a type-safe manner,
// ensuring that the configuration adheres to Vite's expected structure and types.
// This file is essential for configuring the frontend build process in a Vite-powered React application with Tailwind CSS styling.
// The `vite.config.js` file is crucial for setting up the development environment and build process
// for the frontend of the authentication module, ensuring that both React and Tailwind CSS are properly integrated.
// This allows developers to leverage the power of Vite for fast development and efficient production builds.
// The configuration is straightforward, focusing on enabling React and Tailwind CSS without additional complexity. 