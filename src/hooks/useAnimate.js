export const useAnimate = async (
	animateEl,
	animations,
	prefixCls = 'animate__'
) => {
	animations = Array.isArray(animations) ? animations : [animations];

	const play = animate =>
		new Promise(resolve => {
			if (animateEl) {
				const animationName = `${prefixCls}${animate.value}`;

				// 过滤可能残留的animate.css动画类名
				animateEl.classList.value = animateEl.classList.value
					.split(' ')
					.filter(item => !item.includes(prefixCls))
					.join(' ');

				// 设置动画属性
				const setAnimate = () => {
					animateEl.style.setProperty(
						'--animate-duration',
						`${animate.duration}s`
					);
					animateEl.style.setProperty('animation-delay', `${animate.delay}s`);
					animateEl.style.setProperty(
						'animation-iteration-count',
						`${animate.infinite ? 'infinite' : animate.count}`
					);
					animateEl?.classList.add(`${prefixCls}animated`, animationName);
				};

				// 动画结束时，删除类名
				const handleAnimationEnd = event => {
					event?.stopPropagation();
					animateEl.classList.remove(`${prefixCls}animated`, animationName);
					animateEl.removeEventListener('animationend', handleAnimationEnd);
					resolve('animation end');
				};

				setAnimate();

				animateEl?.addEventListener('animationend', handleAnimationEnd, {
					once: true,
				});
				// animateEl?.addEventListener('animationcancel', handleAnimationEnd, { once: true })
			} else {
				resolve('动画执行失败！执行动画元素不存在！');
			}
		});

	for (const item of animations) {
		await play(item);
	}
};
