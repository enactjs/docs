import css from './Tooltip.module.css';

const Tooltip = ({children, title, ...rest}) => {
	const optionalStyle = title?.includes?.('Optional') ?? false;

	return (
		<span className={css.tooltipContainer}>
			{title && (
				<span className={css.tooltip  + ' ' + (optionalStyle ? css.optional : '')} {...rest}>
					{title}
				</span>
			)}
			{children}
		</span>
	)
}

export default Tooltip;