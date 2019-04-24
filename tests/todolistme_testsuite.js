const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const {window} = new JSDOM();
const {document} = (new JSDOM('')).window;
global.document = document;
const $ = jQuery = require('jquery')(window);
const repo = require('../page-objects/element-repo.js');

let tcNumber = 1;

module.exports = {


    before: function (browser) {
        //init browser
        browser
            .useXpath()
            .maximizeWindow()
            .url('http://todolistme.net/');
        browser.page.todome().performLogin();
    },

    after: function (browser) {
        //wait for server sync to complete
        browser.waitForElementVisible(repo.syncIcon, 10000);
        //no need to logout due to volatile nature of chromedriver
    },

    beforeEach: function (browser) {
        //each testcase is put into a list for future reference
        browser.page.todome().createNewList(tcNumber);
        tcNumber++;
    },

    'Add single to do list item'(browser) {
        // browser.page.todome().createNewListItem(1);
    },

    'Add multiple to do list items'(browser) {
        //since no number of list items was specified, let's do a random number of items
        //every time we run the test

        // browser.page.todome().createNewListItem();
    },

    'Mark a todo list item as done'(browser) {

        browser.page.todome().createNewListItem(5, undefined, true);

        let howManyItems = 0;
        const numElementsPromise = new Promise(resolve => {
            browser.elements('xpath', repo.allToDoTasks, result => {
                resolve(result.value.length);
            });
        });

        numElementsPromise.then(numElements => {
            howManyItems = numElements;
        });

        console.log(howManyItems);

    }
}