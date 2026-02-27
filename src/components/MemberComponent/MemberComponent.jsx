import {DocParse} from '../index.js';

const MemberComponent = ({children, member}) => {
	return (
		<>
			<DocParse doc={member.description} />
			{children}
		</>
	)
}

export default MemberComponent;