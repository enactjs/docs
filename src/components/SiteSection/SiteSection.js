import React from 'react';
import clsx from 'clsx';

import styles from './SiteSection.module.css';

/**
 * Section wrapper with optional accent background (same as Gatsby docs).
 * @param {string} [accent] - 'Home' | '1' | '2' | '3' | 'Nav' | 'message'
 * @param {string|React.Component} [component] - Element or component (default: 'section')
 * @param {boolean} [fullHeight]
 */
export default function SiteSection({
  accent,
  component: Component = 'section',
  fullHeight,
  className,
  children,
  ...rest
}) {
  return (
    <Component
      className={clsx(
        styles.siteSection,
        accent && (styles['accent' + accent] || styles[accent]),
        fullHeight && styles.fullHeight,
        className
      )}
      {...rest}
    >
      <div className={styles.frame}>{children}</div>
    </Component>
  );
}
