/**
 * EditMetaRow – only shows Last updated. Edit link is shown only at top (DocItem/Layout).
 * Same as default but we never render EditThisPage here so it doesn't appear in the footer.
 */
import React from 'react';
import clsx from 'clsx';
import LastUpdated from '@theme/LastUpdated';

import styles from './styles.module.css';

export default function EditMetaRow({
  className,
  lastUpdatedAt,
  lastUpdatedBy,
}) {
  const hasLastUpdated = lastUpdatedAt || lastUpdatedBy;
  if (!hasLastUpdated) {
    return null;
  }
  return (
    <div className={clsx('row', className)}>
      <div className={clsx('col', styles.lastUpdated)}>
        <LastUpdated
          lastUpdatedAt={lastUpdatedAt}
          lastUpdatedBy={lastUpdatedBy}
        />
      </div>
    </div>
  );
}
