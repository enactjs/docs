/**
 * Code block component – for use in MDX (same idea as docs Code).
 * Renders children in <pre><code> with optional language class for syntax highlighting.
 * Docusaurus/Prism will style code blocks; this provides a consistent wrapper.
 */
import React from 'react';

export default function Code({ children, type = 'javascript', className = '', ...rest }) {
  const lang = type?.toLowerCase() || 'text';
  return (
    <pre className={className} {...rest}>
      <code className={`language-${lang}`}>{children}</code>
    </pre>
  );
}
