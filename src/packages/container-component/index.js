const modules = import.meta.globEager('./*/index.jsx');

const components = {};

Object.keys(modules).forEach(key => {
	const name = key.replace(/\.\/(.*)\/index\.(tsx|vue)/, '$1');
	components[name] = modules[key]?.default || modules[key];
});

console.log(components, 'container-component');
export default components;
