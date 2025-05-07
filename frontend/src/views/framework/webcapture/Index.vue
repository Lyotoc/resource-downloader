<template>
  <div class="web-capture-container">
    <a-card title="网页资源抓取" class="capture-card">
      <a-form layout="vertical">
        <a-form-item label="网页URL">
          <a-input v-model:value="url" placeholder="请输入要抓取的网页地址" />
        </a-form-item>

        <a-form-item label="抓取选项">
          <a-checkbox-group v-model:value="captureOptions">
            <a-checkbox value="image">图片</a-checkbox>
            <a-checkbox value="video">视频</a-checkbox>
          </a-checkbox-group>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" @click="handleCapture" :loading="loading">
            开始抓取
          </a-button>
        </a-form-item>
      </a-form>

      <a-divider v-if="previewItems.length > 0" />

      <div class="preview-area" v-if="previewItems.length > 0">
        <a-row :gutter="[16, 16]">
          <a-col :span="8" v-for="(item, index) in previewItems" :key="index">
            <a-card hoverable>
              <img v-if="item.type === 'image'" :src="item.preview" class="preview-img" />
              <video v-else-if="item.type === 'video'" controls class="preview-video">
                <source :src="item.preview" />
              </video>
              <div class="actions">
                <a-checkbox v-model:checked="item.selected" />
                <!-- 单个保存按钮可以保留，或者移除，取决于需求，这里先保留 -->
                <!-- <a-button type="link" @click="handleSave(item)" size="small">保存</a-button> -->
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>
      <!-- 将 preview-actions 移动到卡片底部 -->
      <div class="preview-actions" v-if="previewItems.length > 0">
        <a-checkbox v-model:checked="selectAll" @change="handleSelectAll">全选</a-checkbox>
        <a-button type="primary" @click="handleBatchSave" :disabled="selectedItems.length === 0">保存已勾选 ({{
          selectedItems.length }})</a-button>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ipcApiRoute } from '@/api';
import { ipc } from '@/utils/ipcRenderer';
import { message } from 'ant-design-vue';
import { ref, computed } from 'vue'; // 引入 computed

const url = ref('');
const loading = ref(false);
const captureOptions = ref(['image']);
const previewItems = ref([]);
const selectAll = ref(false); // 全选状态

// 计算属性：获取所有被勾选的 item
const selectedItems = computed(() => {
  return previewItems.value.filter(item => item.selected);
});

// 处理全选/取消全选
function handleSelectAll() {
  previewItems.value.forEach(item => {
    item.selected = selectAll.value;
  });
}

// 处理批量保存
function handleBatchSave() {
  if (selectedItems.value.length === 0) {
    message.warning('请先勾选要保存的资源');
    return;
  }
  // 遍历 selectedItems 并调用保存文件的 IPC 方法
  selectedItems.value.forEach(item => {
    console.log(`the item ${JSON.stringify(item)}`);

    ipc.invoke(ipcApiRoute.webcapture.saveFile, { item: { ...item }});
  });
  message.success(`已开始保存 ${selectedItems.value.length} 个资源`);
}


function handleCapture() {
  if (!url.value) {
    // 输入为空时直接返回
    message.error('请输入一个合法的网页地址，例如：https://www.example.com');
    return;
  }

  let processedUrl = url.value.trim();

  // 检查是否缺少协议，如果缺少则默认加上 https://
  if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
    processedUrl = 'https://' + processedUrl;
  }

  // 基本的 URL 合法性校验
  // 这个正则表达式可以匹配 http, https协议，并检查域名部分
  const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
  if (!urlPattern.test(processedUrl)) {
    // 如果 URL 不合法，提醒用户并终止抓取
    message.error('请输入一个合法的网页地址，例如：https://www.example.com');
    return;
  }

  // 如果协议被添加，更新响应式变量 url.value
  if (url.value !== processedUrl) {
    url.value = processedUrl;
  }

  // URL 合法，继续执行抓取逻辑
  loading.value = true;
  previewItems.value = [];

  const args = {
    url: url.value,
    options: [...captureOptions.value],
  };
  ipc.invoke(ipcApiRoute.webcapture.captureWebsite, args).then(result => {
    console.log(`this result ${JSON.stringify(result)}`);

    previewItems.value = result;
  }).catch((err) => {
    console.error('Failed to capture website:', err);
  }).finally(() => {
    loading.value = false;
  })
};

</script>

<style scoped>
.web-capture-container {
  padding: 24px;
}

.capture-card {
  margin-bottom: 24px;
}

.preview-area {
  margin-top: 24px;
  max-height: 400px;
  /* 设置一个最大高度，可以根据实际情况调整 */
  overflow-y: auto;
  /* 允许垂直滚动 */
}

.preview-img,
.preview-video {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
