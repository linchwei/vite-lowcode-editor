import { defineStore } from 'pinia';

const COMPONENT_KEY = 'LOWCODE_COMPONENT';

export const useComponentStore = defineStore('component', {
	state: () => {
		return {
			components: [],
			currentComponent: {},
		};
	},
	getters: {},
	actions: {
		updateComponent(component) {
			this.components.push(component);
			window.sessionStorage.setItem(COMPONENT_KEY, this.components);
		},
		deleteComponent() {
			this.components = {};
			window.sessionStorage.removeItem(COMPONENT_KEY);
		},
		setCurrentPage(components) {
			this.components = components;
			window.sessionStorage.setItem(COMPONENT_KEY, this.components);
			const currentFocus = this.components.blocks.find(item => item.focus);
			setCurrentBlock(currentFocus ?? {});
		},
		setCurrentBlock(currentComponent) {
			this.currentComponent = currentComponent;
		},
	},
});
