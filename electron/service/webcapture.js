const { dialog } = require('electron');
const { chromium } = require('playwright');
const https = require('https');
const fs = require('fs');
const { logger } = require('ee-core/log');

class WebCaptureService {
    /**
     * Capture website resources
     * @param {object} options - Capture options
     * @param {string} options.url - Website URL
     * @param {array} options.options - Capture options (image, video)
     * @returns {Promise<array>} - Array of captured resources
     */
    async captureWebsite({ url, options }) {
        logger.info('[WebCaptureService] captureWebsite, url:', url, 'options:', options);
        try {
            const browser = await chromium.launch();
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: "load" });
            const result = [];

            if (options.includes('image')) {
                const images = await page.$$eval('img', imgs => {
                    return imgs.map(img => ({
                        src: img.src,
                        alt: img.alt,
                    }));
                });
                result.push(...images.map(img => ({ type: 'image', preview: img.src })));
            }

            if (options.includes('video')) {
                const videos = await page.$$eval('video', videos => {
                    return videos.map(video => ({
                        src: video.src,
                        poster: video.poster,
                    }));
                });
                result.push(...videos.map(video => ({ type: 'video', preview: video.src })));
            }

            await browser.close();
            return result;
        } catch (error) {
            logger.error('[WebCaptureService] captureWebsite error:', error);
            return [];
        }
    }

    /**
     * Save captured file
     * @param {object} item - Item to save
     * @param {string} item.preview - URL of the item
     * @param {string} item.type - Type of the item (image, video)
     */
    async saveFile(item) {
        logger.info('[WebCaptureService] saveFile, item:', item);
        const { filePath } = await dialog.showSaveDialog({
            defaultPath: `download.${item.type === 'image' ? 'jpg' : 'mp4'}`
        });

        if (filePath) {
            try {
                const file = fs.createWriteStream(filePath);
                https.get(item.preview, function (response) {
                    response.pipe(file);

                    // after download completed close filestream
                    file.on("finish", () => {
                        file.close();
                        logger.info("Download Completed:", filePath);
                    });
                }).on('error', function (err) { // Handle errors
                    fs.unlink(filePath, (err) => {
                        if (err) logger.error("Error deleting incomplete file:", err);
                        logger.error("Download failed:", err.message);
                    });
                });
            } catch (error) {
                logger.error("File saving failed:", error);
            }
        }
    }
}

module.exports = {
    WebCaptureService,
    webcaptureService: new WebCaptureService()
};
