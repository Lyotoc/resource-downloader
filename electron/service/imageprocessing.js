'use strict';

const fs = require('fs');
const path = require('path');
const { dialog } = require('electron');
const sharp = require('sharp');
const { logger } = require('ee-core/log');

/**
 * ImageProcessingService - 图片处理服务
 * @class
 */
class ImageProcessingService {

    /**
     * 选择图片
     */
    async selectImage() {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] }
            ]
        });
        if (result.canceled) return null;
        return result.filePaths[0];
    }

    /**
     * 去除水印（简单实现，实际可能需要复杂的算法）
     */
    async removeWatermark(imagePath, options) {
        // 这里可以使用图像处理库进行水印去除
        // 目前只是简单地返回原图
        return imagePath;
    }

    /**
     * 改变底色
     */
    async changeBackground(imagePath, color) {
        const outputPath = path.join(path.dirname(imagePath), 'output.png');
        await sharp(imagePath)
            .flatten({ background: color })
            .toFile(outputPath);
        return outputPath;
    }

    /**
     * 调整像素大小
     */
    async resizeImage(imagePath, width, height) {
        const outputPath = path.join(path.dirname(imagePath), 'resized.png');
        await sharp(imagePath)
            .resize(width, height)
            .toFile(outputPath);
        return outputPath;
    }

    /**
     * 设置压缩比
     */
    async compressImage(imagePath, quality) {
        const outputPath = path.join(path.dirname(imagePath), 'compressed.jpg');
        await sharp(imagePath)
            .jpeg({ quality })
            .toFile(outputPath);
        return outputPath;
    }

    /**
     * 转换格式
     */
    async convertFormat(imagePath, format) {
        const outputPath = path.join(path.dirname(imagePath), `converted.${format}`);
        await sharp(imagePath)
            .toFormat(format)
            .toFile(outputPath);
        return outputPath;
    }

    /**
     * 计算压缩后预期大小
     */
    async calculateCompressedSize(imagePath, quality) {
        const stats = fs.statSync(imagePath);
        const originalSize = stats.size;
        logger.info('calculateCompressedSize originalSize', originalSize, quality);
        // 假设压缩后的大小与质量成比例
        const compressedSize = originalSize * (quality / 100);
        logger.info('calculateCompressedSize compressedSize', compressedSize);
        return compressedSize;
    }

    /**
     * 保存处理后的图片
     */
    async saveProcessedImage(options) {
        let processedPath = options.path;
        if (options.options.includes('removeWatermark')) {
            processedPath = await this.removeWatermark(processedPath, options);
        }
        if (options.options.includes('changeBackground')) {
            processedPath = await this.changeBackground(processedPath, options.backgroundColor);
        }
        if (options.options.includes('resize')) {
            processedPath = await this.resizeImage(processedPath, options.width, options.height);
        }
        if (options.options.includes('compress')) {
            processedPath = await this.compressImage(processedPath, options.compressionRatio);
        }
        if (options.options.includes('convertFormat')) {
            processedPath = await this.convertFormat(processedPath, options.format);
        }
        return processedPath;
    }

    /**
     * 选择保存目录
     */
    async selectSaveDirectory() {
        const result = await dialog.showOpenDialog({
            properties: ['openDirectory']
        });
        if (result.canceled) return null;
        return result.filePaths[0];
    }

    /**
     * 获取图片的 base64 数据
     * @param {string} imagePath - 图片路径
     * @returns {Promise<string>} - base64 字符串
     */
    async getImageData(imagePath) {
        try {
            // 使用 sharp 读取图片并转换为 base64
            const imageBuffer = await sharp(imagePath)
                .resize(800, 800, { // 限制预览图大小
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .toBuffer();

            return imageBuffer.toString('base64');
        } catch (error) {
            logger.error('获取图片数据失败:', error);
            throw new Error('获取图片数据失败');
        }
    }
}

module.exports = new ImageProcessingService(); 