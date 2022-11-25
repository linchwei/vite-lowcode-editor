import { Input } from 'ant-design-vue';
import { useGlobalProperties } from '@/hooks/useGlobalProperties';

export default {
  key: 'input',
  moduleName: 'baseWidgets',
  label: '输入框',
  preview: () => <Input placeholder="输入框" />,
  render: ({ props, block, styles }) => {
    const { registerRef } = useGlobalProperties();

    return () => (
      <div style={styles}>
        <Button ref={(el) => registerRef(el, block._vid)} {...props}></Button>
      </div>
    );
  },
};