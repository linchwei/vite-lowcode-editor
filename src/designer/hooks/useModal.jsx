import {
	defineComponent,
	reactive,
	createApp,
	getCurrentInstance,
	isVNode,
} from 'vue';
import { isFunction } from '../utils/is';

const Modal = defineComponent({
	props: {
		options: {
			type: Object,
			default: () => ({}),
		},
	},
	setup(props) {
		const instance = getCurrentInstance();

		const state = reactive({
			options: props.options,
			visible: true,
		});

		const methods = {
			service: options => {
				state.options = options;
				methods.show();
			},
			show: () => (state.visible = true),
			hide: () => (state.visible = false),
		};

		const handler = {
			onConfirm: async () => {
				await state.options.onConfirm?.();
				methods.hide();
			},
			onCancel: () => {
				state.options.onCancel?.();
				methods.hide();
			},
		};

		Object.assign(instance.proxy, methods);

		return () => (
			<a-modal
				v-model={state.visible}
				title={state.options.title}
				destroyOnClose={true}
				{...state.options.props}
				onClose={handler.onCancel}
			>
				{{
					default: () =>
						isVNode(state.options.content) ? (
							<content />
						) : isFunction(state.options.content) ? (
							state.options.content()
						) : null,
					footer: () =>
						state.options.footer === null ? null : (
							<div>
								<a-button {...{ onClick: handler.onCancel }}>取消</a-button>
								<a-button type={'primary'} {...{ onClick: handler.onConfirm }}>
									确定
								</a-button>
							</div>
						),
				}}
			</a-modal>
		);
	},
});

export const useModal = (() => {
	let instance;
	return options => {
		if (instance) {
			instance.service(options);
			return instance;
		}
		const div = document.createElement('div');
		document.body.appendChild(div);
		const app = createApp(Modal, { options });
		instance = app.mount(div);
		return instance;
	};
})();
