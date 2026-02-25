import DocParse from '../DocParse/DocParse.jsx';
import ModuleImports from '../ModuleImports/ModuleImports.jsx';

const Page = async ({data}) => {
	return (
		<>
			<DocParse>{data.description}</DocParse>
			{/*<p>{moduleDescription}</p>*/}
			{/*<ModuleImports moduleName={moduleName} title={title} />*/}
		</>
	)
}

export default Page;