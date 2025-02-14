import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
	{
		title: 'Easy to Use',
		Svg: require('@site/static/img/enact-home-easy.svg').default,
		description: (
			<>
				Enact builds atop the excellent React library, and provides a full framework to the developer. The recent
				boom of web technologies and related tools has led to a plethora of options available. In fact, getting
				started might be the most difficult part of building a modern web application.

			</>
		),
	},
	{
		title: 'Performant',
		Svg: require('@site/static/img/enact-home-perf.svg').default,
		description: (
			<>
				Beyond initial setup, Enact continues to provide benefits. It was built with performance in mind,
				and conscious decisions were made to ensure that applications remain performant as they grow in size
				and complexity. This ranges from the way components are rendered to how data flows through application.
			</>
		),
	},
	{
		title: 'Customizable',
		Svg: require('@site/static/img/enact-home-custom.svg').default,
		description: (
			<>
				Enact has a full set of customizable widgets that can be tuned and tweaked to the particular style of
				each project. Using our experience in building full UI libraries for a broad swath of devices ranging
				from TVs to watches, we have created a widget library whose components can easily be composed to create
				complex views and applications.
			</>
		),
	},
	{
		title: 'Adaptable',
		Svg: require('@site/static/img/enact-home-auto.svg').default,
		description: (
			<>
				Enact was designed to produce native quality applications for a wide variety embedded web platforms.
				Read about <a href="/uses">Enact&rsquo;s use cases</a> and how it helps solve problems for Automotive,
				Robotics, TV and more.
			</>
		),
	},
];

function Feature({Svg, title, description}) {
	return (
		<div className={clsx('col col--4')}>
			<div className="text--center">
				<Svg className={styles.featureSvg} role="img"/>
			</div>
			<div className="text--center padding-horiz--md">
				<Heading as="h3">{title}</Heading>
				<p>{description}</p>
			</div>
		</div>
	);
}

export default function HomepageFeatures() {
	return (
		<section className={styles.features}>
			<div className="container">
				<div className="row">
					{FeatureList.map((props, idx) => (
						<Feature key={idx} {...props} />
					))}
				</div>
			</div>
		</section>
	);
}
