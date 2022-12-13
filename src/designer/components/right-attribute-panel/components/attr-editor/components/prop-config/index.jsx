import { defineComponent } from 'vue';
import { WarningOutlined } from '@ant-design/icons-vue';
import { CrossSortableOptionsEditor } from "../cross-sortable-options-editor/cross-sortable-options-editor";
import { TablePropEditor, } from '../table-prop-editor/table-prop-editor';
import { useDotProp } from '@/designer/hooks/useDotProp';

const VisualEditorPropsType = {
  /** 输入框 */
  input: 'input',
  /** 数字输入框 */
  inputNumber: 'InputNumber',
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
export const PropConfig = defineComponent({
  props: {
    component: {
      type: Object,
      default: () => ({}),
    },
    block: {
      type: Object,
      default: () => ({}),
    },
  },
  setup (props) {
    const renderPropItem = (propName, propConfig) => {
      const { propObj, prop } = useDotProp(props.block.props, propName);

      propObj[prop] ??= propConfig.defaultValue;

      return {
        [VisualEditorPropsType.input]: () => {
          if (!Object.is(propObj[prop], undefined) && !Object.is(propObj[prop], null)) {
            propObj[prop] = `${propObj[prop]}`;
          }
          return (
            <a-input v-model={propObj[prop]} placeholder={propConfig.tips || propConfig.label} />
          );
        },
        [VisualEditorPropsType.inputNumber]: () => {
          const parseRes = parseFloat(propObj[prop]);
          propObj[prop] = Number.isNaN(parseRes) ? 0 : parseRes;
          return <a-input-mumber v-model={propObj[prop]} />;
        },
        [VisualEditorPropsType.switch]: () => <a-switch v-model={propObj[prop]} />,
        [VisualEditorPropsType.crossSortable]: () => (
          <CrossSortableOptionsEditor
            v-model={propObj[prop]}
            multiple={propConfig.multiple}
            showItemPropsConfig={propConfig.showItemPropsConfig}
          />
        ),
        [VisualEditorPropsType.select]: () => (
          <a-select v-model={propObj[prop]} valueKey={'value'} multiple={propConfig.multiple}>
            {propConfig.options?.map((opt) => (
              <a-select-option style={{ fontFamily: opt.value }} value={opt.value} > {opt.label} </a-select-option>
            ))}
          </a-select>
        ),
        [VisualEditorPropsType.table]: () => (
          <TablePropEditor v-model={propObj[prop]} propConfig={propConfig} />
        ),
      }[propConfig.type]();
    };

    return () => {
      return Object.entries(props.component.props ?? {}).map(([propName, propConfig]) => (
        <>
          <a-form-item
            key={props.block._vid + propName}
            style={
              propConfig.labelPosition == 'top'
                ? {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }
                : {}
            }
          >
            {{
              label: () => (
                <>
                  {propConfig.tips && (
                    <a-tooltip
                      placement="left-start"
                      popper-class="max-w-200px"
                      title={propConfig.tips}
                    >
                      <div>
                        <WarningOutlined />
                      </div>
                    </a-tooltip>
                  )}
                  {propConfig.label}
                </>
              ),
              default: () => renderPropItem(propName, propConfig),
            }}
          </a-form-item>
        </>
      ));
    };
  },
});