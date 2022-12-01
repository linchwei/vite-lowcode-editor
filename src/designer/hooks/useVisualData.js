import { reactive, inject, readonly, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { visualConfig } from '@/config/componentModules';

// 保存到本地JSON数据的key
export const localKey = 'PAGE_DATA_KEY';

// 注入jsonData的key
export const injectKey = 'initVisualData';

// 创建新的空页面
export const createNewPage = ({ title = '新页面', path = '/' }) => {
	return {
		title,
		path,
		config: {
			bgColor: '',
			bgImage: '',
			keepAlive: '',
		},
		blocks: [],
	};
};

const defaultValue = {
	pages: {
		'/': createNewPage({ title: '首页' }),
	},
	models: [],
	actions: {
		fetch: {
			name: '接口请求',
			apis: [],
		},
		dialog: {
			name: '对话框',
			handlers: [],
		},
	},
};

export const initVisualData = () => {
	const localData = JSON.parse(sessionStorage.getItem(localKey)) || {};
	const jsonData = Object.keys(localData.pages || {}).length
		? localData
		: defaultValue;

	const route = useRoute();
	const router = useRouter();

	console.log('jsonData', jsonData);

	const getPrefixPath = path => (path.startsWith('/') ? path : `/${path}`);

	const currentPage = jsonData.pages[route.path];

	const state = reactive({
		jsonData,
		currentPage,
		currentBlock: currentPage.blocks.find(item => item.focus) ?? {},
	});
	const paths = Object.keys(jsonData.pages);

	const isExistPath = paths.some(path => route.path === path);

	if (!isExistPath) {
		router.replace(paths[0] || '/');
		state.currentPage = jsonData.pages[paths[0]] ?? defaultValue.pages['/'];
	}

	watch(
		() => route.path,
		url => setCurrentPage(url)
	);

	const updatePage = ({ newPath = '', oldPath, page }) => {
		console.log(state.jsonData.pages[oldPath], page);

		if (newPath || newPath !== oldPath) {
			page.path = newPath;
			state.jsonData.pages[getPrefixPath(newPath)] = {
				...state.jsonData.pages[oldPath],
				...page,
			};
			deletePage(oldPath, getPrefixPath(newPath));
		} else {
			Object.assign(state.jsonData.pages(oldPath), page);
		}
	};
	const incrementPage = (path = '', page) => {
		state.jsonData.pages[getPrefixPath(path)] ??=
			page ?? createNewPage({ path });
	};
	const deletePage = (path = '', redirectPath) => {
		delete state.jsonData.pages[path];
		if (redirectPath) {
			setCurrentPage(redirectPath);
		}
	};
	const setCurrentPage = (path = '/') => {
		state.currentPage = jsonData.pages[path];
		if (state.currentPage) {
			state.currentPage = jsonData.pages['/'];
			router.replace('/');
		}
		const currentFocusBlock = state.currentPage.blocks.find(item => item.focus);
		setCurrentBlock(currentFocusBlock ?? {});
	};

	const setCurrentBlock = block => {
		state.currentBlock = block;
	};

	// 更新pages下面的blocks
	const updatePageBlock = (path = '', blocks = []) => {
		state.jsonData.pages[path].blocks = blocks;
	};

	/**
	 * @description 新建API接口请求
	 */
	const incrementFetchApi = api => {
		state.jsonData.actions.fetch.apis.push(api);
	};

	/**
	 * @description 删除某个API接口
	 */
	const deleteFetchApi = key => {
		const index = state.jsonData.actions.fetch.apis.findIndex(
			item => item.key == key
		);
		if (index !== -1) {
			state.jsonData.actions.fetch.apis.splice(index, 1);
		}
	};

	const updateFetchApi = (api = [], isCover = false) => {
		const fetch = state.jsonData.actions.fetch;
		const apis = Array.isArray(api) ? api : [api];
		if (isCover) {
			fetch.apis = apis;
		} else {
			apis.forEach(apiItem => {
				const target = fetch.apis.find(item => item.key == apiItem.key);
				target && Object.assign(target, api);
			});
		}
	};

	/**
	 * @description 新增模型
	 */
	const incrementModel = model => {
		state.jsonData.models.push(model);
	};

	/**
	 * @description 删除某个模型
	 */
	const deleteModel = key => {
		const index = state.jsonData.models.findIndex(item => item.key == key);
		if (index !== -1) {
			state.jsonData.models.splice(index, 1);
		}
	};

	/**
	 * @param { VisualEditorModel | VisualEditorModel[]} model 模型项或模型数组
	 * @param {boolean} isCover 是否覆盖所有模型
	 * @description 更新某个模型
	 */
	const updateModel = (model = [], isCover = false) => {
		const jsonData = state.jsonData;
		const models = Array.isArray(model) ? model : [model];
		if (isCover) {
			jsonData.models = models;
		} else {
			models.forEach(modelItem => {
				const index = jsonData.models.findIndex(
					item => item.key == modelItem.key
				);
				if (index !== -1) {
					state.jsonData.models.splice(index, 1, modelItem);
				}
			});
		}
	};

	// 使用自定义JSON覆盖整个项目
	const overrideProject = jsonData => {
		state.jsonData =
			typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
	};

	return {
		visualConfig,
		jsonData: readonly(state.jsonData), // 保护JSONData避免直接修改
		currentPage: computed(() => state.currentPage),
		currentBlock: computed(() => state.currentBlock),
		overrideProject,
		incrementFetchApi,
		deleteFetchApi,
		updateFetchApi,
		incrementModel,
		deleteModel,
		updateModel,
		setCurrentPage,
		setCurrentBlock,
		updatePage,
		incrementPage,
		deletePage,
		updatePageBlock,
	};
};

export const useVisualData = () => initVisualData();
