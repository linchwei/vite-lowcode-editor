import { defineComponent } from 'vue';
import { visualConfig } from '@/config/componentModules';

export default defineComponent({
  name: 'CompRender',
  props: {
    element: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    return visualConfig.componentMap[props.element.componentKey].render({
      styles: props.element.styles || {},
      props: props.element.props || {},
      model: {},
      block: props.element,
      custom: {},
    });
  },
});