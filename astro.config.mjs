// @ts-check
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import {defineConfig} from 'astro/config';
import path from 'path';
import starlightLinksValidator from 'starlight-links-validator'

// https://astro.build/config
export default defineConfig({
    base: '/',
    vite: {
        resolve: {
            alias: {
                '@livePreview': path.resolve('./src/components/LivePreview/LivePreview.jsx'),
                '@moduleData': path.resolve('./src/pages/docs/modules'),
                '@modulePage': path.resolve('./src/components/Page/[...data].astro'),
                '@utils': path.resolve('./src/utils/utils.jsx')
            }
        }
    },
    integrations: [starlight({
        plugins: process.env.CHECK_LINKS ? [starlightLinksValidator()] : [],
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
                items: [{autogenerate: {directory: 'modules', collapsed: true}}]
            },
            {
                label: 'Developer Guide',
                items: [{autogenerate: {directory: 'developer-guide', collapsed: true}}]
            },
            {
                label: 'Developer Tools',
                items: [{autogenerate: {directory: 'developer-tools', collapsed: true}}]
            },
            {
                label: 'Tutorials',
                items: [{autogenerate: {directory: 'tutorials/intro', collapsed: true}}]
            },
            {
                label: 'Hello Enact!',
                items: [{autogenerate: {directory: 'tutorials/tutorial-hello-enact', collapsed: true}}]
            },
            {
                label: 'Kitten Browser',
                items: [{autogenerate: {directory: 'tutorials/tutorial-kitten-browser', collapsed: true}}]
            },
            {
                label: 'TypeScript with Enact',
                items: [{autogenerate: {directory: 'tutorials/tutorial-typescript', collapsed: true}}]
            },
        ],
		}),
        react()],
});