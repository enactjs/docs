export default function enactPlugin() {
	return {
		name: 'vite-plugin-enact',
		enforce: 'pre',
		transform(code, id) {
			if (id.includes('enact') && id.endsWith('.js')) {
				return {
					code,
					map: null
				};
			}
		},
		config() {
			return {
				optimizeDeps: {
					esbuildOptions: {
						loader: {
							'.js': 'jsx'
						}
					}
				}
			};
		}
	};
}