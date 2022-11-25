import { getCurrentInstance } from 'vue';

export const useGlobalProperties = () => {
	const globalProperties =
		getCurrentInstance().appContext.config.globalProperties;

	const registerRef = (el, _vid) => el && (globalProperties.$$refs[_vid] = el);

	return {
		globalProperties,
		registerRef,
	};
};
