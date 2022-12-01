import { useGlobalProperties } from '@/hooks/useGlobalProperties';

export default {
  key: 'input',
  moduleName: 'baseWidgets',
  label: '输入框',
  preview: () => <a-input placeholder="输入框" />,
  render: ({ props, block, styles }) => {
    const { registerRef } = useGlobalProperties();

    return () => (
      <div style={styles}>
        <a-input ref={(el) => registerRef(el, block._vid)} {...props} />
      </div>
    );
  },
};