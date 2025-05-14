describe('Landing page', function () {

    beforeEach(() => {
        // Browser to: http://localhost:4200
        browser.url(browser.baseUrl);
    });

    it('should load the page and contain title: "Landing Page"', async function (browser) {
        expect(browser.getTitle()).contain('Landing Page');
    });

    it('should route to register page after clicking "Register"', async function (browser) {
        // Click on register
        browser.click('button[name=register-button]');

        expect(browser.getTitle()).contain('Register');
    });

    it('should route to teacher login page after clicking "Teacher login"', async function (browser) {
        // Click on teacher login
        browser.click('button[name=teacher-login-button]');

        expect(browser.getTitle()).contain('Teacher Login');
    });

    it('should route to student login page after clicking "Student login"', async function (browser) {
        // Click on student
        browser.click('button[name=student-login-button]');

        expect(browser.getTitle()).contain('Student Login');
    });

    it('should have a dwengo logo with an alt text', async function (browser) {
        expect(await browser.element.findByAltText('Dwengo logo')).to.be.present;
    });

});
