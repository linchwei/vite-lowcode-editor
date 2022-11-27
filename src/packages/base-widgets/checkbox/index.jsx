import { Checkbox, CheckboxGroup } from "ant-design-vue";
import {
  createEditorInputProp,
  createEditorSelectProp,
  createEditorSwitchProp,
} from "../../hooks/useEditorProp";
import { useGlobalProperties } from "@/hooks/useGlobalProperties";

export default {
  key: "checkbox",
  moduleName: "baseWidgets",
  label: "多选框",
  preview: () => (
    <CheckboxGroup modelValue={["1"]}>
      <Checkbox name="1" shape="square">
        one
      </Checkbox>
      <Checkbox name="2" shape="square">
        two
      </Checkbox>
    </CheckboxGroup>
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
