import { generateNanoid } from '@/designer/utils';
import { useDotProp } from '@/designer/hooks/useDotProp';
export function createNewBlock(component = {}) {
	const {
		moduleName,
		key: componentKey,
		label,
		props,
		draggable,
		showStyleConfig,
		events = [],
	} = component;
	return {
		_vid: `vid_${generateNanoid()}`,
		moduleName,
		componentKey,
		label,
		adjustPosition: true,
		focus: false,
		styles: {
			display: 'flex',
			justifyContent: 'flex-start',
			paddingTop: '0',
			paddingRight: '0',
			paddingLeft: '0',
			paddingBottom: '0',
			tempPadding: '0',
		},
		hasResize: false,
		props: Object.entries(props || {}).reduce(
			(prev, [propName, propSchema]) => {
				const { propObj, prop } = useDotProp(prev, propName);
				if (propSchema?.defaultValue) {
					propObj[prop] = prev[propName] = propSchema?.defaultValue;
				}
				return prev;
			},
			{}
		),
		draggable, // 是否可以拖拽
		showStyleConfig, // 是否显示组件样式配置
		animations: [], // 动画集
		actions: [], // 动作集合
		events, // 事件集合
		model: {},
	};
}
