describe('Register page', function () {

    const firstName = 'Jan';
    const lastName = 'de Man';
    const schoolname = 'UGent';
    const email = 'jan.deman@ugent.be';
    const password = "azertyuiop";

    beforeEach(() => {
        browser.url(`${browser.baseUrl}/register`);
    });

    it('should be on the register page', async function (browser) {
        expect(browser.getTitle()).contain('Register');
    });

    it('should be able to fill information', async function(browser) {
        // Fill in first name
        await browser.setValue('input[name=first-name]', firstName);
        expect(await browser.getValue('input[name=first-name]')).to.contain(firstName)

        // Fill in family name
        await browser.setValue('input[name=last-name]', lastName);
        expect(await browser.getValue('input[name=last-name]')).to.contain(lastName);

        // Fill in schoolname
        await browser.setValue('input[name=school-name]', schoolname);
        expect(await browser.getValue('input[name=school-name]')).to.contain(schoolname);

        // Check checkbox
        /*
            `input[type=checkbox]` is not directly in the `register.component.html`
            but it will be when the browser renders the component
        */
        await browser.element('input[type=checkbox]').check();
        expect(await browser.getValue('input[type=checkbox]')).to.equal('on');       

        // Fill in email
        await browser.setValue('input[type=email]', email);
        expect(await browser.getValue('input[type=email]')).to.contain(email);

        // Fill in password
        await browser.setValue('input[type=password]', password);
        expect(await browser.getValue('input[type=password]')).to.contain(password);

        // Fill in confirm password
        await browser.setValue('input[id=confirmPassword', password);
        expect(await browser.getValue('input[id=confirmPassword')).to.contain(password);

        // Click on submit button
        await browser.click('button[type=submit]');
    });

});
