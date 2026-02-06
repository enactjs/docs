// @ts-check
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import {defineConfig} from 'astro/config';
import enactPlugin from "./enactPlugin.mjs";

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [enactPlugin()],
        optimizeDeps: {
            exclude: ['ilib']
        }
    },
    integrations: [starlight({
        title: 'Enact',
        logo: {
            src: './src/assets/enact.svg'
        },
        social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/enactjs/enact' }],
        sidebar: [
            {
                label: 'Guides',
                items: [
                    // Each item here is one entry in the navigation menu.
                    {label: 'Example Guide', slug: 'guides/example'},
                ],
            },
            {
                label: 'Reference',
                autogenerate: {directory: 'reference'},
            },
            {
                label: 'Developer Guide',
                autogenerate: {directory: 'developer-guide'},
            },
            {
                label: 'Developer Tools',
                autogenerate: {directory: 'developer-tools'},
            }
        ],
		}),
        react()],
});