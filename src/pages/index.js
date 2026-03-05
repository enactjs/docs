import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';

import styles from './index.module.css';

const Section = ({ icon, title, children }) => (
  <section className={styles.section}>
    <h2 className={styles.sectionTitle}>
      <span className={styles.sectionIcon} aria-hidden="true">{icon}</span>
      {title}
    </h2>
    <ul className={styles.linkList}>
      {children}
    </ul>
  </section>
);

const DocLink = ({ to, children }) => (
  <li><Link to={to}>{children}</Link></li>
);

export default function Home() {
  return (
    <Layout title="Enact Documentation" description="Enact - An app development framework built atop React">
      <main className={clsx(styles.hero, styles.indexPage)}>
        <div className={styles.heroInner}>
          <img
            src={useBaseUrl('/img/logo.svg')}
            alt="Enact"
            className={styles.heroLogo}
          />
          <h1 className={styles.heroTitle}>Developer Documentation
          </h1>
          <p className={styles.heroTagline}>
           Documentation for Enact falls into several categories: Tutorials, Libraries (API) Documentation, Developer Guides and Tools.
          </p>
        </div>

        <div className={styles.sections}>
          <Section icon="📚" title="Tutorials">
            <DocLink to="/docs/tutorials/introduction/">Introduction</DocLink>
            <DocLink to="/docs/tutorials/setup/">Enact Development Setup</DocLink>
            <DocLink to="/docs/tutorials/tutorial-hello-enact/">Hello Enact!</DocLink>
            <DocLink to="/docs/tutorials/tutorial-kitten-browser/">Kitten Browser</DocLink>
            <DocLink to="/docs/tutorials/tutorial-typescript/">TypeScript with Enact</DocLink>
          </Section>

          <Section icon="🧩" title="Libraries">
            <DocLink to="/docs/core/dispatcher/">core</DocLink>
            <DocLink to="/docs/i18n/I18nDecorator/">i18n</DocLink>
            <DocLink to="/docs/">moonstone</DocLink>
            <DocLink to="/docs/">sandstone</DocLink>
            <DocLink to="/docs/spotlight/">spotlight</DocLink>
            <DocLink to="/docs/ui/Button/">ui</DocLink>
            <DocLink to="/docs/webos/application/">webos</DocLink>
          </Section>

          <Section icon="📖" title="Developer Guide">
            <DocLink to="/docs/developer-guide/accessibility/">Accessibility Support in Enact</DocLink>
            <DocLink to="/docs/developer-guide/resources/">Additional Developer Resources</DocLink>
            <DocLink to="/docs/developer-guide/contributing/">Contribution Guide</DocLink>
            <DocLink to="/docs/developer-guide/creating-components/">Creating Components the Enact Way</DocLink>
            <DocLink to="/docs/developer-guide/best-practices/">Enact Best Practices</DocLink>
            <DocLink to="/docs/developer-guide/performance/">Enact Performance Guide</DocLink>
            <DocLink to="/docs/developer-guide/glossary/">Glossary</DocLink>
            <DocLink to="/docs/developer-guide/migration/">Migration Guides</DocLink>
            <DocLink to="/docs/developer-guide/redux/">Redux</DocLink>
            <DocLink to="/docs/developer-guide/spotlight/docs/">Spotlight</DocLink>
            <DocLink to="/docs/developer-guide/testing-components/">Testing Your Components</DocLink>
            <DocLink to="/docs/developer-guide/theming/">Theming</DocLink>
            <DocLink to="/docs/developer-guide/interoperability/">Using Enact with Third-party Libraries</DocLink>
            <DocLink to="/docs/ui/VirtualList/">Using VirtualList, VirtualGridList and Scroller</DocLink>
            <DocLink to="/docs/developer-guide/why-use-kind/">Why Use kind()?</DocLink>
            <DocLink to="/docs/developer-guide/i18n/docs/">i18n (Internationalization)</DocLink>
            <DocLink to="/docs/developer-guide/webos/docs/">webOS Support Module</DocLink>
          </Section>

          <Section icon="🔧" title="Developer Tools">
            <DocLink to="/docs/developer-tools/cli/">Enact CLI Development Tool</DocLink>
            <DocLink to="/docs/developer-tools/eslint-config-enact/">eslint-config-enact Linting Configuration</DocLink>
          </Section>
        </div>
      </main>
    </Layout>
  );
}
