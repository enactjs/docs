import React from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';

import styles from './styles.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.frame}>
        <ul className={styles.nav}>
          <li>
            <Link to="/about">About Us</Link>
          </li>
          <li>
            <Link to="/legal">Legal</Link>
          </li>
          <li>
            <Link to="/cookie">Cookie Policy</Link>
          </li>
          <li>
            <Link to="/contact">Contact Us</Link>
          </li>
          <li>
            <Link to="/uses">Use Cases</Link>
          </li>
        </ul>
        <div className={styles.bottomRow}>
          <ul className={clsx(styles.social, styles.inlineList)}>
            <li>
              <a href="https://twitter.com/EnactJS" target="_blank" rel="noreferrer">
                Twitter
              </a>
            </li>
            <li>
              <a href="https://gitter.im/EnactJS/Lobby" target="_blank" rel="noreferrer">
                Chat
              </a>
            </li>
            <li>
              <a href="https://medium.com/enact-js" target="_blank" rel="noreferrer">
                Blog
              </a>
            </li>
          </ul>
          <p className={styles.copy}>
            Copyright &copy; 2017-{year} LG Electronics
          </p>
        </div>
      </div>
    </footer>
  );
}

