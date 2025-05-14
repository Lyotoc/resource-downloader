const { logger } = require('ee-core/log');
const imageService = require('../service/imageprocessing');


class ImageProcessingController {
    async selectImage() {
        logger.info('selectImage');
        return await imageService.selectImage();
    }

    async removeWatermark(path, options) {
        return await imageService.removeWatermark(path, options);
    }

    async changeBackground(path, color) {
        return await imageService.changeBackground(path, color);
    }

    async resizeImage(path, width, height) {
        return await imageService.resizeImage(path, width, height);
    }

    async compressImage(path, quality) {
        return await imageService.compressImage(path, quality);
    }

    async convertFormat(path, format) {
        return await imageService.convertFormat(path, format);
    }

    async calculateCompressedSize(args, event) {
        const { path, quality } = args;
        logger.info('calculateCompressedSize', path, quality);

        return await imageService.calculateCompressedSize(path, quality);
    }

    saveProcessedImage(args) {
        logger.info('saveProcessedImage', args);
        return imageService.saveProcessedImage(args);
    }

    selectSaveDirectory() {
        return imageService.selectSaveDirectory();
    }

    /**
     * 获取图片数据
     */
    async getImageData(args) {
        try {
            const { imagePath } = args;
            const imageData = await imageService.getImageData(imagePath);
            return imageData;
        } catch (error) {
            throw error;
        }
    }
}

ImageProcessingController.toString = () => '[class ImageProcessingController]';
module.exports = ImageProcessingController;