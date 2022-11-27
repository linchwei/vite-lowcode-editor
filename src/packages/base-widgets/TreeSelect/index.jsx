import { TreeSelect  } from "ant-design-vue";
import {
  createEditorInputProp,
  createEditorSelectProp,
  createEditorSwitchProp,
} from "../../hooks/useEditorProp";
import { useGlobalProperties } from "@/hooks/useGlobalProperties";

export default {
  key: "treeSelect",
  moduleName: "baseWidgets",
  label: "树选择",
  preview: () => (
    <TreeSelect  placeholder="请选择" />
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
