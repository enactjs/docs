// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import {createRequire} from 'module';

const require = createRequire(import.meta.url);

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

function resolveBaseUrl() {
  const explicit = process.env.DOCUSAURUS_BASE_URL || process.env.BASE_URL;
  if (explicit) {
    const normalized = explicit.startsWith('/') ? explicit : `/${explicit}`;
    return normalized.endsWith('/') ? normalized : `${normalized}/`;
  }

  const targetTypeRaw = process.env.TARGET_TYPE || process.env.MULTI_TARGET_TYPE || '';
  const targetType = targetTypeRaw.trim().split(/\s+/).filter(Boolean)[0];
  const versionLabel = process.env.VERSION_LABEL;
  if (!targetType || !versionLabel) return '/';

  const savePermanently = process.env.SAVE_PERMANENTLY;
  const permanentSegment = savePermanently === 'false' ? 'Temporary/docs' : 'docs';
  return `/enact/${targetType}/${permanentSegment}/${versionLabel}/`;
}

const resolvedBaseUrl = resolveBaseUrl();

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
  url: process.env.DOCUSAURUS_SITE_URL || 'https://nebula.lge.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: resolvedBaseUrl,

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
            const docsRepoUrl = `https://github.com/enactjs/docs/blob/feature/docusaurus/docs/${docPath}`;

            if (docPath.startsWith('tutorials/')) return docsRepoUrl;

            if (docPath.startsWith('developer-guide/')) {
              const guidePath = docPath.replace(/^developer-guide\//, '');
              return `https://github.com/enactjs/enact/blob/master/docs/${guidePath}`;
            }

            if (docPath.startsWith('developer-tools/cli/')) {
              const cliPath = docPath.replace(/^developer-tools\/cli\//, '');
              return `https://github.com/enactjs/cli/blob/master/docs/${cliPath}`;
            }

            const match = docPath.match(/^([^/]+)\/([^/]+)\/index\.mdx?$/);
            if (!match) return docsRepoUrl;

            const [, lib, moduleRaw] = match;
            const moduleName = encodeURIComponent(moduleRaw);

            const enactPackageLibs = new Set(['core', 'ui', 'webos', 'spotlight', 'i18n']);
            if (enactPackageLibs.has(lib)) {
              return `https://github.com/enactjs/enact/tree/master/packages/${lib}/${moduleName}/`;
            }

            if (lib === 'sandstone') {
              return `https://github.com/enactjs/sandstone/tree/master/${moduleName}/`;
            }

            if (lib === 'moonstone') {
              return `https://github.com/enactjs/moonstone/tree/master/${moduleName}/`;
            }

            if (lib === 'agate') {
              return `https://github.com/enactjs/agate/tree/master/${moduleName}/`;
            }

            if (lib === 'limestone') {
              return `https://github.com/enactjs/limestone/tree/master/${moduleName}/`;
            }

            return docsRepoUrl;
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
  plugins: [
    [
      // Provides local, client-side search (no Algolia required)
      require.resolve('docusaurus-plugin-search-local'),
      {
        hashed: false, // Avoid query-string variants that can break index fetching
        indexDocs: true,
        indexPages: false,
        indexBlog: false,
      },
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
