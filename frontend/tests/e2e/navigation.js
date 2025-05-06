describe('Navigation', function () {

    it('should load the page and check the title', async function (browser) {
        browser
            .url(browser.baseUrl) // https://nightwatchjs.org/guide/reference/settings.html#postdoc-setting-the-baseurl-property
            .assert.titleContains('Landing Page')
            .end();
    });

});
