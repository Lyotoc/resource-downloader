'use strict';

const { logger } = require('ee-core/log');
const { webcaptureService } = require('../service/webcapture');

class WebCaptureController {
    async captureWebsite(args) {
        const { url, options } = args;
        logger.info("[WebCaptureController] start url", url, "options:", options);
        return webcaptureService.captureWebsite();
    }

    async saveFile(args) {
        const { item } = args;
        webcaptureService.saveFile(item);
    }
}

WebCaptureController.toString = () => '[class WebCaptureController]';

module.exports = WebCaptureController;  