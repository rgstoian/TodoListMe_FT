const repo = require('../page-objects/element-repo.js');
var request = require('sync-request');

//function to get a random number between two integers, where min<=result<max
function getRandomNumber(min, max) {
    let result = Math.floor(Math.random() * (max - min) + min);
    return result;
}

var todomeCommands = {

    //perform a login to log test case results on ToDoMeList's server
    performLogin: function () {

        let browser = this.api;

        //due to an animation playing when opening/closing the sync panel
        //we create two elements for the open panel and the closed panel

        let syncPanelOpen = repo.syncPanel.replace(']', ' and @style=\'display: block;\']');
        let syncPanelClosed = repo.syncPanel.replace(']', ' and @style=\'display: none;\']');

        //open the sync panel and login
        browser
            .waitForElementVisible(repo.syncPanelButton)
            .click(repo.syncPanelButton)
            .waitForElementVisible(syncPanelOpen)
            .setValue(repo.usernameField, repo.username)
            .setValue(repo.passwordField, repo.password)
            .click(repo.syncButton)
        ;

        //check if the user has been logged in via a label that shows the currently logged user
        //then wait for the sync panel to close so it won't interfere with other tests
        //an additional wait is added due to the panel being animated
        browser
            .assert.containsText(repo.loginStatus, repo.username)

        //the website pops up a few options if the local todolist differs from
        //the one that's synced to the account, so we optionally wait for it to pop up
        browser
            .waitForElementVisible(repo.syncWithServerButton, 10000, false)

        //then if it exists click on the button that favors the synced content to the local one
        browser
            .element('xpath', repo.syncWithServerButton, function (elem) {
                if (elem.status === 0) {
                    browser.click(repo.syncWithServerButton);
                }
            });

        //we do the same for the sync panel close button, in case it remains open
        //(it is normally closed by clicking the 'get lists from account' button

        browser
            .waitForElementPresent(syncPanelClosed, abortOnFailure=false);

        browser.getCssProperty(repo.syncPanel, 'display', function (elem) {
            if (elem.value == 'block'){
                browser.click(repo.closeSyncPanelButton);
            }
        });

        //we use the Blank list associated with the account to check if data was loaded properly
        browser
            .waitForElementNotVisible(repo.syncPanel)
            .waitForElementVisible(repo.blankListButton);
    },
    createNewList: function (testCaseNumber) {
        //creates a new list for each testcase for further reference, format is
        //TC + testcase number + dateTime at the start of the test
        //the testcase number is set as a global variable in the main test suite
        //then passed as a parameter and increased

        let listName = 'TC ' + testCaseNumber + ' ' + repo.currentDateTime;

        //create an xpath selector based on the list name
        // and insert it into the blank template from the repo

        let currentList = repo.currentListButton.substr(0, 35)
            + listName
            + repo.currentListButton.substr(35);

        //create the list, assert its existence then switch to it
        //the are some extra clicks on a blank list then on the current list for consistency
        this.api
            .waitForElementVisible(repo.newListButton)
            .click(repo.newListButton)
            .setValue(repo.newListNameField, listName)
            .click(repo.newListSaveButton)
            .waitForElementVisible(currentList)
            .click(repo.blankListButton)
            .click(currentList)
        ;
    },
    createNewListItem: function (minItems, maxItems, useBoringTaskNames) {
        //minItems governs how many items we should create
        //if no parameters are passed, a random number between 2 and 9 is selected
        //if maxItems exists, a number of items between minItems and maxItems is created
        //useBoringTaskNames is used to specify "boring" tasks detailed below, which are faster to write

        let noOfItems = 0;
        let min = 2;
        let max = 10;
        let addedItems = [];

        if (minItems !== undefined && maxItems === undefined) {
            noOfItems = minItems;
        } else {
            if (maxItems !== undefined) {
                min = minItems;
                max = maxItems;
            }
            noOfItems = getRandomNumber(min, max);
        }

        let alreadyDoneIDs = [];
        for (let i = 0; i < noOfItems; i++) {

            //initialize a boring placeholder task in case the method below fails
            //or if it's needed due to faster processing time
            //it should like like "Boring Task #50283" with random numbers
            let listItem = 'Boring Task #' + Math.random().toString().slice(2, 7);

            if (useBoringTaskNames === false || useBoringTaskNames == undefined) {

                let currentID;
                // get a non-boring task from a Truth or Dare generator via REST API
                // the result is in JSON format
                //the id property is used to ensure no duplicate entries
                //the text value is used for the to-do task itself
                do {

                    let response = request('GET', 'https://truthordare-game.com/api/dare/15');
                    let json = JSON.parse(response.getBody());
                    currentID = json.id;
                    listItem = json.text;

                    //check if the "task" has already been used this test run
                } while (currentID !== undefined && alreadyDoneIDs.indexOf(currentID) > -1);
                alreadyDoneIDs.push(currentID);
            }

            //write the task into the new task field
            this.api.setValue(repo.newTaskField, [listItem, this.api.Keys.ENTER]);

            //validate that the task has been successfully created and added to the task list
            this.api
                .waitForElementVisible(repo.mostRecentTask)
                .assert.containsText(repo.mostRecentTask + '//span', listItem);

            addedItems.push(listItem);
        }

        //let's also check that we've added the correct number of items
        let browser = this.api;
        browser.elements('xpath', repo.allToDoTasks, function (result) {
            browser.assert.equal(result.value.length, noOfItems,
                'Expected '+noOfItems+' items to be added, actual '+result.value.length+'.');
        });

        //return an array of the created items
        return addedItems;
    },


    markAsDone: function (existingItems, howMany) {
        let browser = this.api;
        let howManyItems;

        //the method needs the already existing to-do items mak
        if (existingItems == undefined || Array.isArray(existingItems) == false) {
            browser.assert.fail('Parameter existingItems is mandatory');
        }

        //if the parameter is not set, or invalid, mark a random number of items off the list
        if (howMany == undefined || howMany < 1 || howMany > existingItems.length) {
            howManyItems = getRandomNumber(1, existingItems.length);
        } else howManyItems = howMany;

        for (let i = 0; i < howManyItems; i++) {
            //get a random item to mark as done
            let chosenIndex = getRandomNumber(0, existingItems.length);

            //choose and remove an item from the to-do array
            let itemText = existingItems[chosenIndex];
            existingItems.splice(chosenIndex, 1);

            //set its path
            let itemToSelect = repo.toDoListItemByName.substr(0, 53)
                + itemText
                + repo.toDoListItemByName.substr(53);

            //set the path of the expected item when it's sent to the done category
            let expectedMarkedItem = repo.doneListItemByName.substr(0, 57)
                + itemText
                + repo.doneListItemByName.substr(57);

            //click the checkbox of the item and wait for it to disappear from the to-do list
            browser.click(itemToSelect + '//input[@type=\'checkbox\']');
            browser.waitForElementNotPresent(itemToSelect);

            //wait for the item to be marked as done; abortOnFailure is false because we assert its creation below
            browser.waitForElementVisible(expectedMarkedItem, abortOnFailure = false);
            browser.assert.elementPresent(expectedMarkedItem);
        }

        //assert the number of the checked items
        browser.elements('xpath', repo.allDoneTasks, function (result) {
            browser.assert.equal(result.value.length, howManyItems,
                'Expected '+howManyItems+' items to be marked as done, actual '+result.value.length+'.');
        });

    },

    validateProgressBar: function () {
        let browser = this.api;
        let toDoItems;
        let doneItems;

        browser
        //get the number of the to-do items
            .elements('xpath', repo.allToDoTasks, function (todoElements) {
                toDoItems = todoElements.value.length;
            })
            .perform(function () {
                //get the number of the done items
                browser.elements('xpath', repo.allDoneTasks, function (doneElements) {
                    doneItems = doneElements.value.length;
                })
            })
            .perform(function () {

                //the property below is not used because the return value is absolute in pixels instead of relative
                // browser.getCssProperty(repo.doneProgressBar, 'width', function (result) {

                //the length of the bar is dictated by its width attribute, in percentage
                browser.getAttribute(repo.doneProgressBar, 'style', function (result) {
                    let str = result.value;

                    //format width of progressbar as a number
                    let progressBarWidth = parseInt(str.substring(str.lastIndexOf(': ') + 2, str.lastIndexOf('%')));

                    //get a percentage of done items out of total items and round to integer
                    let expectedProgressBarWidth = Math.round((100 * doneItems) / (doneItems + toDoItems));

                    //assert the length of the done bar
                    browser.assert.equal(
                        progressBarWidth,
                        expectedProgressBarWidth,
                        'Expected progress bar to be at '+expectedProgressBarWidth+'%, actual '+progressBarWidth+'%.');

                })
            });
    }

};
module.exports = {
    commands: [todomeCommands]
};