const $ = require('jquery');

let slogan = '//span[@id=\'slogan\']';

//region loginElements
let syncWithServerButton = '//button[contains(text(), \'Overwrite lists\')]';
let loginStatus = '//span[@id=\'loggedinas\']';
let username = 'todolisttest@maillink.live';
let password = 'P@ssw0rd1';
let syncPanelButton = '//a[descendant::img[@title=\'Sync lists to server\']]';
let syncPanel = '//div[@id=\'syncform\']';
let usernameField = '//input[@id=\'syncname\']';
let passwordField = '//input[@id=\'syncpassword\']';
let syncButton = '//input[@id=\'syncbutton\']';
//endregion

let newListButton = '/html//img[@id=\'addlist\']';
let newListNameField = '//input[@id=\'updatebox\']';
let newListSaveButton = '//div[@id=\'inplaceeditor\']//input[@value=\'Save\']';

let currentListButton='//li[child::span[contains(text(), \'New List Test 4/20/2019\')]]';

let currentDateTime=new Date().toLocaleDateString();


module.exports = {

    before: function (browser) {
        browser.useXpath().maximizeWindow();
        browser.url('http://todolistme.net/')
            .click(syncPanelButton)
            .waitForElementVisible(syncPanel)
            .setValue(usernameField, username)
            .setValue(passwordField, password)
            .click(syncButton)
        ;
        browser.waitForElementVisible(syncWithServerButton, 1000, false);
        browser.element('xpath', syncWithServerButton, function (visible) {
            if (visible.status == 0) {
                browser.click(syncWithServerButton);
            }
        });
        browser.assert.containsText(loginStatus, username);
        browser.waitForElementNotVisible(syncPanel);
    },

    'Go to TodoList.me'(browser) {

        browser
            .waitForElementVisible(slogan)
            .assert.containsText(slogan, 'Powerfully Simple')
        ;
    },

    'Create new List'(browser) {
        let listName='New List Test '+currentDateTime;

        browser
            .click(newListButton)
            .setValue(newListNameField, listName)
            .click(newListSaveButton);
        ;
        browser.pause(1000);
    }
}