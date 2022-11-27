import { Select, SelectOption } from "ant-design-vue";
import {
  createEditorInputProp,
  createEditorSelectProp,
  createEditorSwitchProp,
} from "../../hooks/useEditorProp";
import { useGlobalProperties } from "@/hooks/useGlobalProperties";

export default {
  key: "select",
  moduleName: "baseWidgets",
  label: "下拉选择",
  preview: () => (
    <Select placeholder="请选择">
      <SelectOption value="1">
        one
      </SelectOption>
      <SelectOption value="2">
        two
      </SelectOption>
    </Select>
  ),
  render: ({ props, block, styles }) => {
    const { registerRef } = useGlobalProperties();

    return () => (
      <div style={styles}>
        <Button ref={(el) => registerRef(el, block._vid)} {...props}></Button>
      </div>
    );
  },
};
