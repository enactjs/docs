import {withBase} from '../../utils/utils';
import css from './SampleEmbed.module.css';

const SampleEmbed = ({src, title = 'Sample preview'}) => (
	<iframe
		className={css.frame}
		src={withBase(src, true)}
		title={title}
		loading="lazy"
	/>
);

export default SampleEmbed;
