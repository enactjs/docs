// @ts-check
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import {defineConfig} from 'astro/config';
import path from 'path';

// https://astro.build/config
export default defineConfig({
    base: '/',
    vite: {
        resolve: {
            alias: {
                '@livePreview': path.resolve('./src/components/LivePreview/LivePreview.jsx'),
                '@moduleData': path.resolve('./data/pages/modules'),
                '@modulePage': path.resolve('./src/components/Page/[...data].astro'),
                '@utils': path.resolve('./src/utils/utils.jsx')
            }
        }
    },
    integrations: [starlight({
        tableOfContents: false,
        components: {
            Footer: './src/components/Footer/Footer.astro',
            Header: './src/components/Header/Header.astro',
            Hero: './src/components/Hero/Hero.astro',
            PageTitle: './src/components/PageTitle/PageTitle.astro',
            Sidebar: './src/components/Sidebar/Sidebar.astro',
            TwoColumnContent: './src/components/TwoColumnContent/TwoColumnContent.astro',
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
            },
            {
                label: 'Developer Guide',
                autogenerate: {directory: 'developer-guide', collapsed: true}
            },
            {
                label: 'Developer Tools',
                autogenerate: {directory: 'developer-tools', collapsed: true}
            },
            {
                label: 'Tutorials',
                autogenerate: {directory: 'tutorials/intro', collapsed: true}
            },
            {
                label: 'Hello Enact!',
                autogenerate: {directory: 'tutorials/tutorial-hello-enact', collapsed: true},
            },
            {
                label: 'Kitten Browser',
                autogenerate: {directory: 'tutorials/tutorial-kitten-browser', collapsed: true}
            },
            {
                label: 'TypeScript with Enact',
                autogenerate: {directory: 'tutorials/tutorial-typescript', collapsed: true}
            },
        ],
		}),
        react()],
});