/**
 * DocItem Footer – same as default but without "Edit this page" in the footer.
 * Edit on GitHub is shown only at the top of the page (in DocItem/Layout), like in the reference docs.
 */
import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import TagsListInline from '@theme/TagsListInline';
import EditMetaRow from '@theme/EditMetaRow';

export default function DocItemFooter() {
  const {metadata} = useDoc();
  const {lastUpdatedAt, lastUpdatedBy, tags} = metadata;
  const canDisplayTagsRow = tags.length > 0;
  const canDisplayEditMetaRow = !!(lastUpdatedAt || lastUpdatedBy);
  const canDisplayFooter = canDisplayTagsRow || canDisplayEditMetaRow;

  if (!canDisplayFooter) {
    return null;
  }

  return (
    <footer
      className={clsx(ThemeClassNames.docs.docFooter, 'docusaurus-mt-lg')}>
      {canDisplayTagsRow && (
        <div
          className={clsx(
            'row margin-top--sm',
            ThemeClassNames.docs.docFooterTagsRow,
          )}>
          <div className="col">
            <TagsListInline tags={tags} />
          </div>
        </div>
      )}
      {canDisplayEditMetaRow && (
        <EditMetaRow
          className={clsx(
            'margin-top--sm',
            ThemeClassNames.docs.docFooterEditMetaRow,
          )}
          editUrl={null}
          lastUpdatedAt={lastUpdatedAt}
          lastUpdatedBy={lastUpdatedBy}
        />
      )}
    </footer>
  );
}
