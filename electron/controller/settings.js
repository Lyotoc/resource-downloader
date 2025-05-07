const { autoUpdaterService } = require('../service/os/auto_updater')
class SettingsController {
    /**
     * 检查是否有新版本
     */
    checkForUpdater() {
        autoUpdaterService.checkUpdate();
        return;
    }

    /**
     * 下载新版本
     */
    downloadApp() {
        autoUpdaterService.download();
        return;
    }
}

SettingsController.toString = () => '[class SettingsController]';

module.exports = SettingsController;  