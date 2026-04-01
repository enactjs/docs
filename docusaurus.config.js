// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Enact',
  tagline: 'Enact - An app development framework built atop React that\'s easy to use, performant and customizable.',
  favicon: 'img/favicon.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'enactjs', // GitHub org/user name.
  projectName: 'docs', // Repo name.

  onBrokenLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: ({docPath}) => {
            if (docPath.startsWith('tutorials/')) {
              return `https://github.com/enactjs/docs/blob/feature/docusaurus/docs/${docPath}`;
            }

            if (docPath.startsWith('developer-guide/')) {
              const guidePath = docPath.replace(/^developer-guide\//, '');
              return `https://github.com/enactjs/enact/blob/develop/docs/${guidePath}`;
            }

            if (docPath.startsWith('developer-tools/cli/')) {
              const cliPath = docPath.replace(/^developer-tools\/cli\//, '');
              return `https://github.com/enactjs/cli/blob/develop/docs/${cliPath}`;
            }

            const match = docPath.match(/^([^/]+)\/([^/]+)\/index\.mdx?$/);
            if (match) {
              const lib = match[1];
              const moduleName = encodeURIComponent(match[2]);

              if (lib === 'core' || lib === 'ui' || lib === 'webos') {
                return `https://github.com/enactjs/enact/tree/develop/packages/${lib}/${moduleName}/`;
              }

              if (lib === 'spotlight') {
                return `https://github.com/enactjs/enact/tree/develop/packages/spotlight/${moduleName}/`;
              }

              if (lib === 'i18n') {
                return `https://github.com/enactjs/enact/tree/develop/packages/i18n/${moduleName}/`;
              }

              if (lib === 'sandstone') {
                return `https://github.com/enactjs/sandstone/tree/develop/${moduleName}/`;
              }

              if (lib === 'moonstone') {
                return `https://github.com/enactjs/moonstone/tree/develop/${moduleName}/`;
              }
            }

            return `https://github.com/enactjs/docs/blob/feature/docusaurus/docs/${docPath}`;
          },
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/enactjs/docs/edit/feature/docusaurus/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Enact',
        logo: {
          alt: 'Enact logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            to: '/',
            label: 'Home',
            position: 'left',
            exact: true,
          },
          {
            to: '/getting-started',
            label: 'Getting Started',
            position: 'left',
          },
          {
            type: 'doc',
            docId: 'api',
            label: 'API',
            position: 'left',
          },
          {
            to: '/docs/tutorials/',
            label: 'Tutorials',
            position: 'left',
          },
          {
            href: 'https://github.com/enactjs/enact',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://enactjs.com/sampler',
            label: 'UI Components',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        // All visual footer content is provided by the custom theme Footer component.
        // Leave links empty so default columns like "About", "Community", "More" are not rendered.
        links: [],
        copyright: `Copyright © 2017-${new Date().getFullYear()} LG Electronics`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
