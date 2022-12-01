import { createApp } from 'vue';
import App from './App.vue';

import { setupAntDesign } from './plugins/ant-design';

import router from './router/';
import { setupStore } from './store/';

const app = createApp(App);

setupAntDesign(app);
setupStore(app);
app.config.globalProperties.$$refs = {};

window.$$refs = app.config.globalProperties.$$refs;
app.use(router);
router.isReady().then(() => app.mount('#app'));
