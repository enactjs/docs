import Link from '@docusaurus/Link';
import {Row, Cell} from '@enact/ui/Layout';
import React from 'react';

import {SiteSection} from '../SiteSection';

import styles from './HomepageFeatures.module.css';

const FeatureList = [
    {
        title: 'Easy to Use',
        Svg: require('@site/static/img/enact-home-easy.svg').default,
        description: (
            <>
                Enact builds atop the excellent React library, and provides a full framework to the developer.
                The recent boom of web technologies and related tools has led to a plethora of options available.
                In fact, getting started might be the most difficult part of building a modern web application.
            </>
        ),
    },
    {
        title: 'Performant',
        Svg: require('@site/static/img/enact-home-perf.svg').default,
        description: (
            <>
                Beyond initial setup, Enact continues to provide benefits.
                It was built with performance in mind, and conscious decisions were made to ensure
                that applications remain performant as they grow in size and complexity.
                This ranges from the way components are rendered to how data flows through application.
            </>
        ),
    },
    {
        title: 'Customizable',
        Svg: require('@site/static/img/enact-home-custom.svg').default,
        description: (
            <>
                Enact has a full set of customizable widgets that can be tuned and tweaked
                to the particular style of each project. Using our experience in building full
                UI libraries for a broad swath of devices ranging from TVs to watches, we have
                created a widget library whose components can easily be composed to create complex
                views and applications.
            </>
        ),
    },
    {
        title: 'Adaptable',
        Svg: require('@site/static/img/enact-home-auto.svg').default,
        description: (
            <>
                Enact was designed to produce native quality applications for a wide variety
                embedded web platforms.  Read about <a href="/uses">Enact&rsquo;s use cases </a>
                and how it helps solve problems for Automotive, Robotics, TV and more.
            </>
        ),
    },
];

function Feature({Svg, title, description}) {
    return (
        <Row align="center" wrap className={styles.reason}>
            <Cell size="12em" className={styles.image}>
                <Svg className={styles.featureSvg} role="img"/>
            </Cell>
            <Cell className={styles.description}>
                <h3>{title}</h3>
                <p>{description}</p>
            </Cell>
        </Row>
    );
}

export default function HomepageFeatures() {
    return (
        <div>
            <SiteSection>
                {FeatureList.map((props, idx) => (
                    <Feature key={idx} {...props} />
                ))}
            </SiteSection>

            <SiteSection accent="3" className={styles.message}>

                <p>The goal of Enact is to provide the building blocks for creating robust and maintainable applications.  To that end, we&rsquo;ve pulled together the best solutions for internationalization (i18n), accessibility (a11y), focus management, linting, testing and building. Then, we created a set of reusable components and behaviors on top of that. We combined these pieces and ensured that they work together seamlessly, allowing developers to focus on implementation.</p>

            </SiteSection>

            <SiteSection>
                <Row wrap>
                    <Cell size="30%" className={styles.cell}>
                        <h4>Installation</h4>
                        <p>To make things simple, Enact provides a simple command-line tool to initialize projects and perform common actions.  Installing it is as easy as:</p>
                        <p><code>npm install -g @enact/cli</code></p>
                        <p>
                            <Link className={styles.button} to="/docs/tutorials/setup/">Setup Guide</Link>
                        </p>
                    </Cell>

                    <Cell size="30%" className={styles.cell}>
                        <h4>Meet Sandstone</h4>
                        <p>Sandstone is our TV-centric UI library. With over 50 components to choose from, Sandstone provides a solid base for creating applications designed for large screens.</p>
                        <p>
                            <Link className={styles.button} to="/docs/sandstone/Button/">Sandstone API</Link>
                        </p>
                    </Cell>

                    <Cell size="30%" className={styles.cell}>
                        <h4>Contributing</h4>
                        <p>The Enact team welcomes contributions from anyone motivated to help out.</p>
                        <p>
                            <Link className={styles.button} to="/docs/developer-guide/contributing/">Contribution Guide</Link>
                        </p>
                    </Cell>
                </Row>
            </SiteSection>
        </div>
    );
}
