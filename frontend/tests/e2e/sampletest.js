// tests/e2e/sampleTest.js
describe('Sample Test', function () {
    it('should load the page and check the title', function (browser) {
      browser
        .navigateTo('https://example.com')
        .assert.titleContains('Example Domain')
        .end();
    });
  });
