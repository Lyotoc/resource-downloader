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

      <div class="preview-area">
        <a-row :gutter="[16, 16]">
          <a-col :span="8" v-for="(item, index) in previewItems" :key="index">
            <a-card hoverable>
              <img v-if="item.type === 'image'" :src="item.preview" class="preview-img" />
              <video v-else-if="item.type === 'video'" controls class="preview-video">
                <source :src="item.preview" />
              </video>
              <div class="actions">
                <a-checkbox v-model:checked="item.selected" />
                <a-button type="link" @click="handleSave(item)" size="small">保存</a-button>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ipcRenderer } from 'electron';
import { ARow, ACol, ACard, AForm, AFormItem, AInput, ACheckboxGroup, ACheckbox, AButton, Divider } from 'ant-design-vue';

const url = ref('');
const loading = ref(false);
const captureOptions = ref(['image']);
const previewItems = ref([]);

const handleCapture = async () => {
  if (!url.value) return;

  loading.value = true;
  previewItems.value = [];

  try {
    const result = await ipcRenderer.invoke('capture-website', {
      url: url.value,
      options: captureOptions.value,
    });

    previewItems.value = result;
  } catch (error) {
    console.error('Failed to capture website:', error);
  } finally {
    loading.value = false;
  }
};

const handleSave = (item) => {
  ipcRenderer.send('save-file', item);
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
