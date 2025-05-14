<template>
    <div class="image-processing-container">
        <a-card title="图片处理" class="processing-card">
            <a-form layout="vertical">
                <a-form-item label="选择图片">
                    <a-button @click="selectImage">选择图片</a-button>
                    <div v-if="imagePath" class="preview-container">
                        <img :src="previewImageData" class="selected-image" @click="showLightbox = true" />
                        <vue-easy-lightbox v-if="showLightbox" :visible.sync="showLightbox" :imgs="[previewImageData]"
                            :index="0" />
                    </div>
                </a-form-item>

                <a-form-item label="处理选项">
                    <a-checkbox-group v-model:value="processingOptions">
                        <a-checkbox value="removeWatermark">去除水印/Logo</a-checkbox>
                        <a-checkbox value="changeBackground">更改底色</a-checkbox>
                        <a-checkbox value="resize">自定义像素大小</a-checkbox>
                        <a-checkbox value="compress">设置压缩比</a-checkbox>
                        <a-checkbox value="convertFormat">设置图片格式</a-checkbox>
                    </a-checkbox-group>
                </a-form-item>

                <a-form-item v-if="processingOptions.includes('changeBackground')" label="选择底色">
                    <a-input type="color" v-model:value="backgroundColor" @change="updatePreview" />
                </a-form-item>

                <a-form-item v-if="processingOptions.includes('resize')" label="像素大小">
                    <a-input-number v-model:value="width" placeholder="宽度" @change="updatePreview" /> x
                    <a-input-number v-model:value="height" placeholder="高度" @change="updatePreview" />
                </a-form-item>

                <a-form-item v-if="processingOptions.includes('compress')" label="压缩比">
                    <a-slider v-model:value="compressionRatio" :min="0" :max="100" @change="updateCompressedSize" />
                    <div v-if="compressedSize">预期压缩后大小: {{ compressedSize.toFixed(2) }} MB</div>
                </a-form-item>

                <a-form-item v-if="processingOptions.includes('convertFormat')" label="图片格式">
                    <a-select v-model:value="imageFormat" @change="updatePreview">
                        <a-select-option value="png">PNG</a-select-option>
                        <a-select-option value="jpeg">JPEG</a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="选择保存目录">
                    <a-button @click="selectSaveDirectory">选择目录</a-button>
                    <span v-if="saveDirectory">{{ saveDirectory }}</span>
                </a-form-item>

                <a-form-item>
                    <a-button type="primary" @click="applyProcessing" :loading="processing">
                        {{ processing ? '处理中...' : '应用处理' }}
                    </a-button>
                </a-form-item>
            </a-form>

            <a-progress v-if="processing" :percent="progress" status="active" />

            <a-alert v-if="error" type="error" :message="error" show-icon closable @close="error = ''" />

            <div v-if="processingHistory.length > 0" class="history-section">
                <h3>处理历史</h3>
                <a-list :data-source="processingHistory">
                    <template #renderItem="{ item }">
                        <a-list-item>
                            <a-list-item-meta>
                                <template #title>{{ item.filename }}</template>
                                <template #description>
                                    <div>处理时间: {{ item.timestamp }}</div>
                                    <div>处理选项: {{ item.options.join(', ') }}</div>
                                </template>
                            </a-list-item-meta>
                            <template #actions>
                                <a-button type="link" @click="openProcessedImage(item.path)">查看</a-button>
                            </template>
                        </a-list-item>
                    </template>
                </a-list>
            </div>
        </a-card>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { ipcApiRoute } from '@/api';
import { ipc } from '@/utils/ipcRenderer';
import VueEasyLightbox from 'vue-easy-lightbox';
import { message } from 'ant-design-vue';

const imagePath = ref('');
const previewImageData = ref('');
const processingOptions = ref([]);
const backgroundColor = ref('#ffffff');
const width = ref(800);
const height = ref(800);
const compressionRatio = ref(50);
const imageFormat = ref('png');
const compressedSize = ref(null);
const saveDirectory = ref('');
const showLightbox = ref(false);
const processing = ref(false);
const progress = ref(0);
const error = ref('');
const processingHistory = ref([]);

async function selectImage() {
    try {
        const path = await ipc.invoke(ipcApiRoute.imageprocessing.selectImage);
        if (path) {
            imagePath.value = path;
            // 获取图片的 base64 数据
            const imageData = await ipc.invoke(ipcApiRoute.imageprocessing.getImageData, path);
            previewImageData.value = `data:image/png;base64,${imageData}`;
            updateCompressedSize();
        }
    } catch (error) {
        message.error('选择图片失败');
    }
}

async function updatePreview() {
    if (imagePath.value) {
        try {
            const imageData = await ipc.invoke(ipcApiRoute.imageprocessing.getImageData, imagePath.value);
            previewImageData.value = `data:image/png;base64,${imageData}`;
        } catch (error) {
            message.error('更新预览图失败');
        }
    }
}

function selectSaveDirectory() {
    ipc.invoke(ipcApiRoute.imageprocessing.selectSaveDirectory).then(directory => {
        saveDirectory.value = directory;
    });
}

function updateCompressedSize() {
    if (imagePath.value && processingOptions.value.includes('compress')) {
        ipc.invoke(ipcApiRoute.imageprocessing.calculateCompressedSize, { path: imagePath.value, quality: compressionRatio.value }).then(size => {
            compressedSize.value = size / (1024 * 1024); // 转换为MB
        });
    }
}

async function applyProcessing() {
    if (!imagePath.value) {
        message.error('请先选择图片');
        return;
    }
    if (!saveDirectory.value) {
        message.error('请选择保存目录');
        return;
    }

    processing.value = true;
    progress.value = 0;
    error.value = '';

    try {
        const options = {
            path: imagePath.value,
            options: processingOptions.value,
            backgroundColor: backgroundColor.value,
            width: width.value,
            height: height.value,
            compressionRatio: compressionRatio.value,
            format: imageFormat.value,
            saveDirectory: saveDirectory.value
        };

        // 监听处理进度
        ipc.on(ipcApiRoute.imageprocessing.progress, (event, progressValue) => {
            progress.value = progressValue;
        });

        const result = await ipc.invoke(ipcApiRoute.imageprocessing.saveProcessedImage, options);

        // 添加到处理历史
        processingHistory.value.unshift({
            filename: result.filename,
            path: result.path,
            timestamp: new Date().toLocaleString(),
            options: processingOptions.value
        });

        message.success('图片处理完成并已保存！');
    } catch (err) {
        error.value = `处理失败: ${err.message}`;
        message.error('图片处理失败');
    } finally {
        processing.value = false;
        progress.value = 0;
    }
}

function openProcessedImage(path) {
    ipc.invoke(ipcApiRoute.imageprocessing.openImage, path);
}
</script>

<style scoped>
.image-processing-container {
    padding: 24px;
}

.processing-card {
    margin-bottom: 24px;
}

.preview-container {
    margin-top: 16px;
    text-align: center;
}

.selected-image {
    max-width: 100%;
    max-height: 400px;
    object-fit: contain;
    cursor: pointer;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    padding: 4px;
}

.history-section {
    margin-top: 24px;
    border-top: 1px solid #f0f0f0;
    padding-top: 16px;
}

.history-section h3 {
    margin-bottom: 16px;
}
</style>
