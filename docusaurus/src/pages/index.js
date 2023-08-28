import kind from '@enact/core/kind';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import PropTypes from 'prop-types';
import React from 'react';

import HomepageFeatures from '../components/HomepageFeatures';
import {SiteSection} from '../components/SiteSection';

// import Page from '../components/Page';
// import SiteSection from '../components/SiteSection';
// import SiteTitle from '../components/SiteTitle';

import styles from './index.module.css';

// images
import starsSmall from '../../static/img/stars-small.svg';

const HomepageHeader = kind({
    name: 'Home',
    propTypes: {
        body: PropTypes.string,
        location: PropTypes.object
    },
    styles: {
        styles,
        className: 'home'
    },
    render ({className}) {
        return (<div >
                <div title="Enact Framework">
                    <div className={className}>
                        <SiteSection accent="Home" className={styles.hero}>
                            <div className={styles.image}>
                                <img alt="Cute animated getting ready image" loading="eager" placeholder="none" src="../../static/img/enact-home-hero.svg" />
                            </div>
                            <div className={styles.intro} style={{backgroundImage: `url(${starsSmall})`}}>
                                <div className={styles.ufoTrack}><img className={styles.ufo} alt="Cheerful floating UFO" loading="eager" placeholder="none" src="../../static/img/ufo.svg" /></div>
                                <p>An app development framework built atop React that&rsquo;s easy to use, performant and customizable.</p>
                                <div className={styles.buttons}>
                                    <Link className={styles.button} to="/getting-started/">Getting Started</Link>
                                    <Link className={styles.button} to="/docs/sandstone/button">API</Link>
                                </div>
                            </div>
                        </SiteSection>
                    </div>
                </div>
            </div>
        );
    }
});

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
          <SiteSection>
            <HomepageFeatures />
          </SiteSection>
      </main>
    </Layout>
  );
}
