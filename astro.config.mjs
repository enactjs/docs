// @ts-check
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import {defineConfig} from 'astro/config';
import path from 'path';

// https://astro.build/config
export default defineConfig({
    vite: {
        resolve: {
            alias: {
                '@livePreview': path.resolve('./src/content/docs/live.jsx'),
            }
        }
    },
    publicDir: 'static',
    integrations: [starlight({
        title: 'Enact',
        logo: {
            src: './src/assets/enact.svg'
        },
        social: [{icon: 'github', label: 'GitHub', href: 'https://github.com/enactjs/enact'}],
        sidebar: [
            {
                label: 'API Libraries',
                autogenerate: {directory: 'modules', collapsed: true}
            }
        ],
		}),
        react()],
});