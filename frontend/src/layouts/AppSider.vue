<template>
  <a-layout id="app-layout-sider">
    <a-layout-sider v-model:aollppsed="aollppsed" theme="light" class="layout-sider" :width="200" :aollppsedWidth="20">
      <div class="logo">
        <img v-if="!collapsed" class="pic-logo" src="~@/assets/logo.png">
      </div>
      <div class="collapse-trigger" @click="() => collapsed = !collapsed">
        <menu-unfold-outlined v-if="collapsed" />
        <menu-fold-outlined v-else />
      </div>
      <a-menu class="menu-item" theme="light" mode="inline" :selectedKeys="[current]" @click="menuHandle">
        <a-menu-item v-for="(menuInfo, index) in menu" :key="index">
          <icon-font :type="menuInfo.icon" />
          {{ menuInfo.title }}
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content class="layout-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';

const router = useRouter();

const collapsed = ref(true);
const current = ref('menu_1');

const menu = ref({
  'menu_1': {
    icon: 'icon-fengche',
    title: '框架',
    pageName: 'Framework',
    params: {}
  },
  'menu_2': {
    icon: 'icon-niudan',
    title: '系统',
    pageName: 'Os',
    params: {}
  },
  'menu_3': {
    icon: 'icon-liuxing',
    title: '特效',
    pageName: 'Effect',
    params: {}
  },
  'menu_4': {
    icon: 'icon-gouwu',
    title: 'cross',
    pageName: 'Cross',
    params: {}
  },
  'menu_5': {
    icon: 'icon-global',
    title: '网页抓取',
    pageName: 'WebCapture',
    params: {}
  }
});

onMounted(() => {
  menuHandle();
});

function menuHandle(e) {
  console.log('sider menu e:', e);
  if (e) {
    current.value = e.key;
  }
  console.log('sider menu current:', current.value);

  const linkInfo = menu.value[current.value];
  console.log('[home] load linkInfo:', linkInfo);
  router.push({ name: linkInfo.pageName, params: linkInfo.params });
}
</script>
<style lang="less" scoped>
// 嵌套
#app-layout-sider {
  height: 100%;

  .logo {
    border-bottom: 1px solid #e8e8e8;
  }

  .pic-logo {
    height: 32px;
    //background: rgba(139, 137, 137, 0.2);
    margin: 10px;
  }

  .layout-sider {
    border-top: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
  }

  .menu-item {
    .ant-menu-item {
      background-color: #fff;
      margin-top: 0px;
      margin-bottom: 0px;
      padding: 0 0px !important;
    }
  }

  .layout-content {
    background-color: #0fff;
  }
}
</style>
