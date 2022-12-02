import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
	{
		path: '/:pathMatch(.*)*',
		component: () => import('@/designer/index.vue'),
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

export default router;
