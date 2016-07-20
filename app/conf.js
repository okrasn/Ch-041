exports.config = {
    framework : "jasmine",
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['schedule.spec.js'],
    multiCapabilities: [{
        browserName: 'firefox'
    }, {
        browserName: 'chrome'
    }]
};
