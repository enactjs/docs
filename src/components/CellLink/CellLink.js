import React from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';

import styles from './CellLink.module.css';

export default function CellLink({ to, children, size, className, ...rest }) {
  const style = size ? { flexBasis: size } : undefined;
  return (
    <Link
      to={to}
      className={clsx(styles.cell, className)}
      style={style}
      {...rest}
    >
      {children}
    </Link>
  );
}
