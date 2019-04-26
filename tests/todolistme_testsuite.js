const repo = require('../page-objects/element-repo.js');

let tcNumber = 1;
process.on('error', e => console.warn(e.stack));

module.exports = {

    beforeEach: function (browser) {

        //init browser
        browser
            .useXpath()
            .maximizeWindow()
            .url('http://todolistme.net/');

        let page = browser.page.todome();

        page.performLogin();

        //each testcase is put into a list for future reference
        page.createNewList(tcNumber);
        tcNumber++;
    },

    afterEach: function (browser) {
        //wait for server sync to complete
        browser.waitForElementVisible(repo.syncIcon, 10000);
        //no need to logout due to volatile nature of chromedriver
        browser.end();
    },

    '\n\ Scenario: Add single to do list item\n\
\n\
    Given the user is on the to do list page\n\
    When the user adds a to do list item\n\
    Then the item shows up as a to do list item'(browser) {
        browser.page.todome().createNewListItem(1);
    },

    '\n\ Scenario: Add multiple to do list items\n\
\n\
    Given the user is on the to do list page\n\
    When the user adds more than 1 to do list items\n\
    Then the items shows up as a to do list items'(browser) {
        //since no number of list items was specified, let's do a random number of items
        //every time we run the test
        browser.page.todome().createNewListItem();
    },

    '\n\ Scenario: Mark a to do list item as done\n\
\n\
    Given the user is on the to do list page\n\
    When the user marks a to do list item as done\n\
    Then the to do list item is marked as done'(browser) {
        //since no number of list items was specified, let's do a random number of items
        //every time we run the test
        let page = browser.page.todome();
        let addedItems = page.createNewListItem();
        page.markAsDone(addedItems, 1);
    },

    '\n\ Scenario: Mark multiple items as done\n\
\n\
    Given the user is on the to do list page\n\
    And there are at least 10 to do items\n\
    When the user marks 5 to do items as done\n\
    Then the marked to do list items are marked as done'(browser) {
        //since no number of list items was specified, let's do a random number of items
        //every time we run the test
        let page = browser.page.todome();

        //use placeholder task names for better performance
        let addedItems = page.createNewListItem(10, 20, true);

        //mark 5 items as done
        page.markAsDone(addedItems, 5);
    },

    '\n\ Scenario: Check the progress bar\n\
\n\
    Given the user is on the to do list page\n\
    And there are exactly 10 to do list items\n\
    When the user marks 5 to do list items as done\n\
    Then the progress bar should be at 50%'(browser) {
        let page = browser.page.todome();
        let addedItems = page.createNewListItem(10);

        //mark 5 items as done
        page.markAsDone(addedItems, 5);

        //validate the 'done' progress bar
        page.validateProgressBar();
    }
}