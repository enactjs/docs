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
                '@moduleData': path.resolve('./data/pages/modules'),
                '@modulePage': path.resolve('./src/components/Page/[...data].astro')
            }
        }
    },
    publicDir: 'static',
    integrations: [starlight({
        tableOfContents: false,
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