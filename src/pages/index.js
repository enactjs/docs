import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';

import styles from './index.module.css';

export default function Home() {
  const heroImg = useBaseUrl('/img/enact-home-hero.svg');
  const ufoImg = useBaseUrl('/img/ufo.svg');
  const starsImg = useBaseUrl('/img/stars-small.svg');
  const easyImg = useBaseUrl('/img/enact-home-easy.svg');
  const perfImg = useBaseUrl('/img/enact-home-perf.svg');
  const customImg = useBaseUrl('/img/enact-home-custom.svg');
  const autoImg = useBaseUrl('/img/enact-home-auto.svg');

  return (
    <Layout title="Enact Framework" description="Overview of Enact documentation and APIs">
      <main className={styles.gettingStarted}>
        <section className={`${styles.hero} ${styles.homeHero}`}>
          <div className={styles.heroArt}>
            <img src={starsImg} alt="" className={styles.heroStars} />
            <img src={heroImg} alt="Cute animated getting ready image" className={styles.heroImage} />
          </div>
          <div className={styles.heroContent}>
            <div className={styles.heroUfoTrack}>
              <img src={ufoImg} alt="Cheerful floating UFO" className={styles.heroUfo} />
            </div>
            <p>
              An app development framework built atop React that’s easy to use,
              performant and customizable.
            </p>
            <div className={styles.heroButtons}>
              <Link className={styles.button} to="/getting-started">
                Getting Started
              </Link>
              <Link className={styles.button} to="/docs/api">
                API
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.reasons}>
          <div className={styles.frame}>
            <div className={styles.reason}>
              <div className={styles.reasonImage}>
                <img src={easyImg} alt="Easy to Use illustration" />
              </div>
              <div className={styles.reasonContent}>
                <h3>Easy to Use</h3>
                <p>
                  Enact builds atop the excellent React library, and provides a full framework
                  to the developer. The recent boom of web technologies and related tools has
                  led to a plethora of options available. In fact, getting started might be the
                  most difficult part of building a modern web application.
                </p>
              </div>
            </div>

            <div className={`${styles.reason} ${styles.reasonAlt}`}>
              <div className={styles.reasonImage}>
                <img src={perfImg} alt="Performant illustration" />
              </div>
              <div className={styles.reasonContent}>
                <h3>Performant</h3>
                <p>
                  Beyond initial setup, Enact continues to provide benefits. It was built with
                  performance in mind, and conscious decisions were made to ensure that
                  applications remain performant as they grow in size and complexity. This
                  ranges from the way components are rendered to how data flows through
                  application.
                </p>
              </div>
            </div>

            <div className={styles.reason}>
              <div className={styles.reasonImage}>
                <img src={customImg} alt="Customizable illustration" />
              </div>
              <div className={styles.reasonContent}>
                <h3>Customizable</h3>
                <p>
                  Enact has a full set of customizable widgets that can be tuned and tweaked to
                  the particular style of each project. Using our experience in building full UI
                  libraries for a broad swath of devices ranging from TVs to watches, we have
                  created a widget library whose components can easily be composed to create
                  complex views and applications.
                </p>
              </div>
            </div>

            <div className={`${styles.reason} ${styles.reasonAlt}`}>
              <div className={styles.reasonImage}>
                <img src={autoImg} alt="Adaptable illustration" />
              </div>
              <div className={styles.reasonContent}>
                <h3>Adaptable</h3>
                <p>
                  Enact was designed to produce native quality applications for a wide variety
                  embedded web platforms.{' '}
                  <Link to="/uses">Read about Enact’s use cases</Link> and how it helps solve
                  problems for Automotive, Robotics, TV and more.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.message}>
          <p>
            The goal of Enact is to provide the building blocks for creating robust and
            maintainable applications. To that end, we’ve pulled together the best
            solutions for internationalization (i18n), accessibility (a11y), focus
            management, linting, testing and building. Then, we created a set of reusable
            components and behaviors on top of that. We combined these pieces and ensured
            that they work together seamlessly, allowing developers to focus on
            implementation.
          </p>
        </section>

        <section className={styles.contentSection}>
          <div className={styles.frame}>
            <div className={styles.content}>
              <div className={styles.cell}>
                <h4>Installation</h4>
                <p>
                  To make things simple, Enact provides a simple command-line tool to
                  initialize projects and perform common actions. Installing it is as easy
                  as:
                </p>
                <pre className={styles.codeBlock}>
                  <code>npm install -g @enact/cli</code>
                </pre>
                <Link className={styles.button} to="/docs/tutorials/setup/">
                  Setup Guide
                </Link>
              </div>

              <div className={styles.cell}>
                <h4>Meet Sandstone</h4>
                <p>
                  Sandstone is our TV-centric UI library. With over 50 components to choose
                  from, Sandstone provides a solid base for creating applications designed
                  for large screens.
                </p>
                <Link className={styles.button} to="/docs/ui/Button/">
                  Sandstone API
                </Link>
              </div>

              <div className={styles.cell}>
                <h4>Contributing</h4>
                <p>
                  The Enact team welcomes contributions from anyone motivated to help out.
                </p>
                <Link className={styles.button} to="/docs/developer-guide/contributing/">
                  Contribution Guide
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
