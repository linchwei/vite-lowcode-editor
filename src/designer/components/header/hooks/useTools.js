import { reactive } from 'vue';
import { message } from 'ant-design-vue';
export const useTools = () => {
	const { jsonData } = { jsonData: {} };
	const state = reactive({
		coverRadio: 'current',
		importJsonValue: '',
	});
	const importJsonChange = value => {
		state.importJsonValue = value;
	};

	return [
		{
			title: '导出JSON',
			onClick: () => {
				const { copy } = useClipboard({ source: JSON.stringify(jsonData) });

				copy()
					.then(() => message.success('复制成功'))
					.catch(err => message.error(`复制失败：${err}`));
			},
		},
		{
			title: '复制页面',
			onClick: () => {
				message.info({
					content: '敬请期待！',
				});
			},
		},
		{
			title: '撤销',
			onClick: () => {
				message.info({
					content: '敬请期待！',
				});
			},
		},
		{
			title: '重做',
			onClick: () => {
				message.info({
					content: '敬请期待！',
				});
			},
		},
		{
			title: '清空页面',
			onClick: () => {
				message.info({
					content: '敬请期待！',
				});
			},
		},
		{
			title: '预览',
			onClick: () => {
				localStorage.setItem(localKey, JSON.stringify(jsonData));
				window.open(location.href.replace('/#/', '/preview/#/'));
			},
		},
	];
};
