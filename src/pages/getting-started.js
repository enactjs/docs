import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';

import SiteSection from '../components/SiteSection/SiteSection';
import CellLink from '../components/CellLink/CellLink';

import styles from './index.module.css';

const TUTORIALS = [
  { to: '/docs/tutorials/introduction/', title: 'Introduction' },
  { to: '/docs/tutorials/setup/', title: 'Enact Development Setup' },
  { to: '/docs/tutorials/tutorial-hello-enact/', title: 'Hello Enact!' },
  { to: '/docs/tutorials/tutorial-kitten-browser/', title: 'Kitten Browser' },
  { to: '/docs/tutorials/tutorial-typescript/', title: 'TypeScript with Enact' },
];

const LIBRARIES = [
  { to: '/docs/core/dispatcher/', title: 'core' },
  { to: '/docs/i18n/I18nDecorator/', title: 'i18n' },
  { to: '/docs/', title: 'moonstone' },
  { to: '/docs/', title: 'sandstone' },
  { to: '/docs/spotlight/', title: 'spotlight' },
  { to: '/docs/ui/Button/', title: 'ui' },
  { to: '/docs/webos/application/', title: 'webos' },
];

const DEVELOPER_GUIDE = [
  { to: '/docs/developer-guide/accessibility/', title: 'Accessibility Support in Enact' },
  { to: '/docs/developer-guide/resources/', title: 'Additional Developer Resources' },
  { to: '/docs/developer-guide/contributing/', title: 'Contribution Guide' },
  { to: '/docs/developer-guide/creating-components/', title: 'Creating Components the Enact Way' },
  { to: '/docs/developer-guide/best-practices/', title: 'Enact Best Practices' },
  { to: '/docs/developer-guide/performance/', title: 'Enact Performance Guide' },
  { to: '/docs/developer-guide/glossary/', title: 'Glossary' },
  { to: '/docs/developer-guide/migration/', title: 'Migration Guides' },
  { to: '/docs/developer-guide/redux/', title: 'Redux' },
  { to: '/docs/developer-guide/spotlight/docs/', title: 'Spotlight' },
  { to: '/docs/developer-guide/testing-components/', title: 'Testing Your Components' },
  { to: '/docs/developer-guide/theming/', title: 'Theming' },
  { to: '/docs/developer-guide/interoperability/', title: 'Using Enact with Third-party Libraries' },
  { to: '/docs/ui/VirtualList/', title: 'Using VirtualList, VirtualGridList and Scroller' },
  { to: '/docs/developer-guide/why-use-kind/', title: 'Why Use kind()?' },
  { to: '/docs/developer-guide/i18n/docs/', title: 'i18n (Internationalization)' },
  { to: '/docs/developer-guide/webos/docs/', title: 'webOS Support Module' },
];

const DEVELOPER_TOOLS = [
  { to: '/docs/developer-tools/cli/', title: 'Enact CLI Development Tool' },
  { to: '/docs/developer-tools/eslint-config-enact/', title: 'eslint-config-enact Linting Configuration' },
];

function LinkBox({ imageSrc, imageAlt, label, links }) {
  return (
    <section className={styles.linkBox}>
      <div className={styles.imageContainer}>
        <img src={imageSrc} alt={imageAlt} className={styles.image} />
        <br />
        {label}
      </div>
      <div className={styles.contentCell}>
        <div className={`${styles.content} ${styles.linkGrid}`}>
          {links.map(({ to, title }) => (
            <CellLink key={to} to={to} className={styles.linkGridItem}>
              {title}
            </CellLink>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function GettingStarted() {
  const gettingStartedImg = useBaseUrl('/img/getting-started.svg');
  const tutorialsImg = useBaseUrl('/img/tutorials.svg');
  const modulesImg = useBaseUrl('/img/modules.svg');
  const guideImg = useBaseUrl('/img/guide.svg');
  const devtoolsImg = useBaseUrl('/img/devtools.svg');

  return (
    <Layout title="Getting Started" description="Enact Developer Guide Table of Contents">
      <div className={styles.gettingStarted}>
        <SiteSection accent="2">
          <section className={`${styles.hero} ${styles.gettingStartedHero}`}>
            <div className={styles.gettingStartedHeroImage}>
              <img
                src={gettingStartedImg}
                alt="Get ready for take-off!"
              />
            </div>
            <div className={styles.heroContent}>
              <h1>Developer Documentation</h1>
              <p>
                Documentation for Enact falls into several categories: Tutorials,
                Libraries (API) Documentation, Developer Guides and Tools.
              </p>
              <p>
                <Link to="/docs/tutorials/">Tutorials</Link>
                {' · '}
                <Link to="/docs/api">API</Link>
              </p>
            </div>
          </section>
        </SiteSection>

        <SiteSection>
          <LinkBox
            imageSrc={tutorialsImg}
            imageAlt="Icon of a magnifying glass looking at the cover of a book"
            label="Tutorials"
            links={TUTORIALS}
          />
          <hr />
          <LinkBox
            imageSrc={modulesImg}
            imageAlt="Icon of a stack of building blocks"
            label="Libraries"
            links={LIBRARIES}
          />
          <hr />
          <LinkBox
            imageSrc={guideImg}
            imageAlt="Icon of a placemark pinpointing a spot in an open book"
            label="Developer Guide"
            links={DEVELOPER_GUIDE}
          />
          <hr />
          <LinkBox
            imageSrc={devtoolsImg}
            imageAlt="Icon of a book being worked on with a wrench"
            label="Developer Tools"
            links={DEVELOPER_TOOLS}
          />
        </SiteSection>
      </div>
    </Layout>
  );
}

