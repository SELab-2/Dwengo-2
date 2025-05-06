describe('Navigation', function () {

    it('should load the page and check the title', async function (browser) {
        browser
            .url(browser.baseUrl)
            .assert.titleContains('Landing Page')
            .end();
    });

});
