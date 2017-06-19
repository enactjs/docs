const elasticlunr = require('elasticlunr'),
	jsonata = require('jsonata'),
	readdirp = require('readdirp'),
	jsonfile = require('jsonfile');

const outFile = 'docIndex.json';

// Note: The $map($string) is needed because spotlight has a literal 'false' in a return type!
const expression = `{
  "title": name,
  "description": $join(description.**.value, ' '),
  "memberDescriptions": $join(members.**.value ~> $map($string), ' '),
  "members": $join(**.members.*.name,' ')
}`;

let index = elasticlunr(function () {
	this.addField('title');
	this.addField('description');
	this.addField('members');
	this.addField('memberDescriptions');
	this.setRef('title');
	this.saveDocument(false);
});

readdirp({root: 'pages/docs/modules', fileFilter: '*.json'}, (err, res) => {
	if (!err) {
		res.files.forEach(result => {
			const filename = result.fullPath;
			const json = jsonfile.readFileSync(filename);
			try {
				index.addDoc(jsonata(expression).evaluate(json));
			} catch (ex) {
				console.log(`Error parsing ${result.path}`);
				console.log(ex);
			}
		});
		jsonfile.writeFileSync(outFile, index.toJSON());
	} else {
		console.error('Unable to find parsed documentation!');
		process.exit(1);
	}
});
