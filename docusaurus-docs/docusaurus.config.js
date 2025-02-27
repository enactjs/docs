// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Enact JS',
  tagline: 'An app development framework built atop React that’s easy to use, performant and customizable.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: './src/css/custom.scss',
        },
      }),
    ],
  ],

  plugins: ['docusaurus-plugin-sass'],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        logo: {
          alt: 'Enact Logo',
          src: 'img/enact.svg',
        },
        items: [
          {
            href: '/',
            label: 'Home',
            position: 'right'
          },
          {
            type: 'docSidebar',
            sidebarId: 'gettingStartedSidebar',
            label: 'Getting Started',
            position: 'right'
          },
          {
            href: '/modules/',
            label: 'API',
            position: 'right'
          },
          {
            href: 'https://github.com/enactjs/enact',
            label: 'GitHub',
            position: 'right'
          },
          {
            href: 'https://enactjs.com/sampler',
            label: 'UI Components',
            position: 'right'
          }
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'About',
            items: [
              {
                label: 'About us',
                to: '/about/'
              },
              {
                label: 'Legal',
                to: '/legal/'
              },
              {
                label: 'Cookie Policy',
                to: '/cookie/'
              },
              {
                label: 'Contact Us',
                to: '/contact/'
              },
              {
                label: 'Use Cases',
                to: '/uses/'
              }
            ]
          },
          {
            title: 'Social',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/EnactJS'
              },
              {
                label: 'Chat',
                href: 'https://gitter.im/EnactJS/Lobby'
              },
              {
                label: 'Blog',
                href: 'https://medium.com/enact-js'
              }
            ]
          }
        ],
        copyright: `Copyright &copy; 2017-${new Date().getFullYear()} LG Electronics`
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    })
};

export default config;
