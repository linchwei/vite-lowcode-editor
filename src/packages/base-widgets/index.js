const modules = import.meta.globEager('./*/index.jsx');

const components = {};

Object.entries(modules).forEach(([key, module]) => {
	const name = key.replace(/\.\/(.*)\/index\.(tsx|vue)/, '$1');
	components[name] = module?.default || module;
});

console.log(components, 'base-widgets');
export default components;
