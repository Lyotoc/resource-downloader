import * as AntIcon from '@ant-design/icons-vue';
import Antd from 'ant-design-vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia'; // 导入 createPinia
import App from './App.vue';
import './assets/global.less';
import './assets/theme.less';
import components from './components/global';
import Router from './router/index';

const app = createApp(App)
app.config.productionTip = false

// components
for (const i in components) {
  app.component(i, components[i])
}

// icon
for (const i in AntIcon) {
  const whiteList = ['createFromIconfontCN', 'getTwoToneColor', 'setTwoToneColor', 'default']
  if (!whiteList.includes(i)) {
    app.component(i, AntIcon[i])
  }
}

const pinia = createPinia(); // 创建 Pinia 实例

app.use(Antd).use(Router).use(pinia).mount('#app'); // 挂载 Pinia
