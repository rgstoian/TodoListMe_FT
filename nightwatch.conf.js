const chromedriver = require('chromedriver');

module.exports = {
    src_folders : ["tests"],
    page_objects_path:["page-objects"],

    test_settings: {
        default: {
            webdriver: {
                start_process: true,
                server_path: chromedriver.path,
                port: 4444,
                cli_args: ['--port=4444']
            },
            desiredCapabilities: {
                browserName: 'chrome',
                javascriptEnabled: true,
                acceptSslCerts: true,
                chromeOptions: {
                    args: ['headless','window-size=1920,3160', 'disable-gpu']
                    // args: ['disable-gpu']
                }
            }
        }
    }
};