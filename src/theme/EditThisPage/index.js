/**
 * Edit on GitHub link – same label and style as Enact docs.
 * editUrl is typically the full GitHub edit URL for the doc.
 */
import React from 'react';

export default function EditThisPage({editUrl}) {
  if (!editUrl) return null;
  return (
    <div className="editOnGitHub">
      <a href={editUrl} target="_blank" rel="noopener noreferrer">
        Edit on GitHub
      </a>
    </div>
  );
}
