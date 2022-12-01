import { getCurrentInstance } from 'vue';

export const useGlobalProperties = () => {
	const globalProperties =
		getCurrentInstance().appContext.config.globalProperties;
	console.log('getCurrentInstance', globalProperties);
	const registerRef = (el, _vid) => el && (globalProperties.$$refs[_vid] = el);

	return {
		globalProperties,
		registerRef,
	};
};
