import { defineStore } from 'pinia';

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    collapsed: false, // 侧边栏折叠状态
  }),
  actions: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
      console.log(`collapsed ${this.collapsed}`);
    },
    setCollapsed(value) {
      this.collapsed = value;
    }
  },
});
