import { defineConfig } from 'astro/config';
import react from "@astrojs/react";

global.__DEV__ = true;
process.env.__DEV__=true;


// https://astro.build/config
export default defineConfig({
  // ...
  integrations: [
    // ...
    react({
      experimentalReactChildren: true,
    }),
  ],
  define: {
    "__DEV__":  true,
  },
  optimizeDeps: {
    include: ['@enact/**/*.css','@enact/**/*.jsx','@enact/**/*.js'],
  },
});