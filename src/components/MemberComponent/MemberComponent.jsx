import {DocParse} from '../index.js';

const MemberComponent = ({children, member}) => {
	return (
		<>
			<DocParse description={member.description} />
			{children}
		</>
	)
}

export default MemberComponent;