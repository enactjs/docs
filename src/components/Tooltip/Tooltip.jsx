import css from './Tooltip.module.css';

const Tooltip = ({children, title, ...rest}) => {
	return (
		<span className={css.tooltipContainer}>
			<span className={css.tooltip} {...rest}>{title}</span>
			{children}
		</span>
	)
}

export default Tooltip;