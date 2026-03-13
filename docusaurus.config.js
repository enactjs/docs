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
  favicon: 'img/favicon.ico',

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
          // Base URL for \"Edit this page\" links
          editUrl:
            'https://github.com/enactjs/docs/edit/feature/docusaurus/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Not used in this project (no blog), but keep consistent.
          editUrl:
            'https://github.com/enactjs/docs/edit/feature/docusaurus/',
          // Useful options to enforce blogging best practices
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
            to: '/docs/developer-guide/',
            label: 'Developer Guide',
            position: 'left',
          },
          {
            to: '/docs/developer-tools/',
            label: 'Developer Tools',
            position: 'left',
          },
          {
            to: '/docs/tutorials/',
            label: 'Tutorials',
            position: 'left',
          },
          {
            href: 'https://github.com/enactjs/docs/tree/feature/docusaurus',
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
