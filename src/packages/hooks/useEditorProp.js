export const VisualEditorPropsType = {
	/** 输入框 */
	input: 'input',
	/** 数字输入框 */
	inputNumber: 'InputNumber',
	/** 颜色选择器 */
	color: 'color',
	/** 下拉选择器 */
	select: 'select',
	/** 表格 */
	table: 'table',
	/** 开关 */
	switch: 'switch',
	/** 模型绑定选择器 */
	modelBind: 'ModelBind',
	/** 可拖拽项 */
	crossSortable: 'CrossSortable',
};

export function createEditorInputProp({ label, defaultValue, tips }) {
	return {
		type: VisualEditorPropsType.input,
		label,
		tips,
		defaultValue,
	};
}

export function createEditorSelectProp({
	label,
	options,
	defaultValue,
	tips,
	multiple,
}) {
	return {
		type: VisualEditorPropsType.select,
		label,
		defaultValue,
		tips,
		options,
		multiple,
	};
}

export function createEditorSwitchProp({ label, defaultValue, tips }) {
	return {
		type: VisualEditorPropsType.switch,
		label,
		tips,
		defaultValue,
	};
}
