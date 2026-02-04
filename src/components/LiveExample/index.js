import React, {useRef, useEffect, useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './styles.module.css';

/**
 * Embeds a live Enact code example using the sample runner iframe.
 * Sends code via postMessage to the runner which uses react-live to render it.
 */
export default function LiveExample({code, runner = 'core', title = 'Live Example'}) {
	const iframeRef = useRef(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		if (!iframeRef.current || !code || !mounted) return;

		const sendCode = () => {
			const win = iframeRef.current?.contentWindow;
			if (win) {
				win.postMessage({source: 'enact-docs', code}, '*');
			}
		};

		// Runner needs time to mount and register message listener
		const timer = setTimeout(sendCode, 500);
		return () => clearTimeout(timer);
	}, [code, mounted]);

	const runnerUrl = useBaseUrl(`/${runner}-runner/`);

	return (
		<div className={styles.container}>
			{title && <div className={styles.title}>{title}</div>}
			<iframe
				ref={iframeRef}
				src={runnerUrl}
				title={title}
				className={styles.iframe}
				sandbox="allow-scripts allow-same-origin"
				onLoad={() => setMounted(true)}
			/>
		</div>
	);
}
