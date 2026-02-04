import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';

import styles from './index.module.css';

export default function Home() {
  return (
    <Layout title="Welcome" description="Enact - An app development framework built atop React">
      <main className={clsx(styles.hero, 'hero')}>
        <div className={styles.heroInner}>
          <img
            src={useBaseUrl('/img/logo.svg')}
            alt="Enact"
            className={styles.heroLogo}
          />
          <h1 className={styles.heroTitle}>Enact</h1>
          <p className={styles.heroTagline}>
            An app development framework built atop React that's easy to use,
            performant and customizable.
          </p>
          <div className={styles.heroButtons}>
            <Link
              className={clsx('button button--secondary button--lg', styles.heroButton)}
              to="/docs/developer-tools/cli/installation"
            >
              Getting Started
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
