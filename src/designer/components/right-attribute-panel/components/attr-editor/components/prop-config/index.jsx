import { computed, defineComponent } from 'vue';
import {
  ElColorPicker,
  ElInput,
  ElOption,
  ElSelect,
  ElSwitch,
  ElCascader,
  ElInputNumber,
  ElFormItem,
  ElTooltip,
  ElIcon,
  ExpandTrigger,
} from 'element-plus';
import { cloneDeep } from 'lodash-es';
import { Warning } from '@element-plus/icons-vue';
import { TablePropEditor, CrossSortableOptionsEditor } from '../../components';
import { useDotProp } from '@/visual-editor/hooks/useDotProp';
import { VisualEditorPropsType } from '@/visual-editor/visual-editor.props';
import { useVisualData } from '@/visual-editor/hooks/useVisualData';

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
    const { jsonData } = useVisualData();
    /**
     * @description 模型集合
     */
    const models = computed(() => cloneDeep(jsonData.models));

    const renderPropItem = (propName, propConfig) => {
      const { propObj, prop } = useDotProp(props.block.props, propName);

      propObj[prop] ??= propConfig.defaultValue;

      return {
        [VisualEditorPropsType.input]: () => {
          if (!Object.is(propObj[prop], undefined) && !Object.is(propObj[prop], null)) {
            propObj[prop] = `${propObj[prop]}`;
          }
          return (
            <ElInput v-model={propObj[prop]} placeholder={propConfig.tips || propConfig.label} />
          );
        },
        [VisualEditorPropsType.inputNumber]: () => {
          const parseRes = parseFloat(propObj[prop]);
          propObj[prop] = Number.isNaN(parseRes) ? 0 : parseRes;
          return <ElInputNumber v-model={propObj[prop]} />;
        },
        [VisualEditorPropsType.switch]: () => <ElSwitch v-model={propObj[prop]} />,
        [VisualEditorPropsType.color]: () => <ElColorPicker v-model={propObj[prop]} />,
        [VisualEditorPropsType.crossSortable]: () => (
          <CrossSortableOptionsEditor
            v-model={propObj[prop]}
            multiple={propConfig.multiple}
            showItemPropsConfig={propConfig.showItemPropsConfig}
          />
        ),
        [VisualEditorPropsType.select]: () => (
          <ElSelect v-model={propObj[prop]} valueKey={'value'} multiple={propConfig.multiple}>
            {propConfig.options?.map((opt) => (
              <ElOption label={opt.label} style={{ fontFamily: opt.value }} value={opt.value} />
            ))}
          </ElSelect>
        ),
        [VisualEditorPropsType.table]: () => (
          <TablePropEditor v-model={propObj[prop]} propConfig={propConfig} />
        ),
        [VisualEditorPropsType.modelBind]: () => (
          <ElCascader
            clearable={true}
            props={{
              checkStrictly: true,
              children: 'entitys',
              label: 'name',
              value: 'key',
              expandTrigger: ExpandTrigger.HOVER,
            }}
            placeholder="请选择绑定的请求数据"
            v-model={propObj[prop]}
            options={[...models.value]}
          ></ElCascader>
        ),
      }[propConfig.type]();
    };

    return () => {
      return Object.entries(props.component.props ?? {}).map(([propName, propConfig]) => (
        <>
          <ElFormItem
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
                    <ElTooltip
                      placement="left-start"
                      popper-class="max-w-200px"
                      content={propConfig.tips}
                    >
                      <div>
                        <ElIcon>
                          <Warning />
                        </ElIcon>
                      </div>
                    </ElTooltip>
                  )}
                  {propConfig.label}
                </>
              ),
              default: () => renderPropItem(propName, propConfig),
            }}
          </ElFormItem>
        </>
      ));
    };
  },
});