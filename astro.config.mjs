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
                '@livePreview': path.resolve('./src/components/LivePreview/LivePreview.jsx'),
                '@modulePage': path.resolve('./src/components/Page/Page.astro')
            }
        }
    },
    publicDir: 'static',
    integrations: [starlight({
        components: {
            PageTitle: './src/components/TitleWithButton/TitleWithButton.astro',
            TwoColumnContent: './src/components/RightSideBar/RightSideBar.astro',
        },
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