import DocParse from '../DocParse/DocParse.jsx';

const MemberHoC = ({children, member, ...rest}) => {
	const {description} = member;

	return (
		<div {...rest}>
			<DocParse doc={description} />
			{children}
		</div>

	)
}

export default MemberHoC;