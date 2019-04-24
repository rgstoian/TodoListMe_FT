const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const {window} = new JSDOM();
const {document} = (new JSDOM('')).window;
global.document = document;
const $ = jQuery = require('jquery')(window);

const repo = require('../page-objects/element-repo.js');

var todomeCommands = {
    performLogin: function () {
        //perform a login to log test case results on ToDoMeList's server

        //open the sync panel and login
        this
            .api
            .waitForElementVisible(repo.syncPanelButton)
            .click(repo.syncPanelButton)
            .waitForElementVisible(repo.syncPanel)
            .setValue(repo.usernameField, repo.username)
            .setValue(repo.passwordField, repo.password)
            .click(repo.syncButton)
        ;

        //the website pops up a few options if the local todolist differs from
        //the one that's synced to the account, so we optionally wait for it to pop up
        this
            .api
            .waitForElementVisible(repo.syncWithServerButton, 1000, false);

        //then if it exists click on the button that favors the synced content to the local one
        this
            .api
            .element('xpath', repo.syncWithServerButton, function (visible) {
                if (visible.status === 0) {
                    this.click(repo.syncWithServerButton);
                }
            });

        //check if the user has been logged in via a label that shows the currently logged user
        //then wait for the sync panel to close so it won't interfere with other tests
        //an additional wait is added due to the panel being animated
        this
            .api
            .assert.containsText(repo.loginStatus, repo.username)
            .waitForElementNotVisible(repo.syncPanel)
            .pause(1000);
    },
    createNewList: function (testCaseNumber) {
        //creates a new list for each testcase for further reference, format is
        //TC + testcase number + dateTime at the start of the test
        //the testcase number is set as a global variable in the main test suite
        //then passed as a parameter and increased

        let listName = 'TC ' + testCaseNumber + ' ' + repo.currentDateTime;

        //create an xpath selector based on the list name
        // and insert it into the blank template from the repo

        repo.currentListButton = repo.currentListButton.substr(0, 35)
            + repo.currentDateTime
            + repo.currentListButton.substr(35);

        //create the list, assert its existence then switch to it
        //the are some extra clicks on a blank list then on the current list for consistency
        this.api
            .click(repo.newListButton)
            .setValue(repo.newListNameField, listName)
            .click(repo.newListSaveButton)
            .waitForElementVisible(repo.currentListButton)
            .click(repo.blankListButton)
            .click(repo.currentListButton)
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

        if (minItems !== undefined && maxItems === undefined) {
            noOfItems = minItems;
        } else {
            if (maxItems !== undefined) {
                min = minItems;
                max = maxItems;
            }
            noOfItems = Math.floor(Math.random() * (max - min) + min);
        }

        let alreadyDoneIDs = [];
        for (let i = 0; i < noOfItems; i++) {

            //initialize a boring placeholder task in case the method below fails
            //or if it's needed due to faster processing time
            //it should like like "Boring Task #50283" with random numbers
            let listItem = 'Boring Task #' + Math.random().toString().slice(2, 7);

            if (useBoringTaskNames === false || useBoringTaskNames === undefined) {

                let currentID;
                // get a non-boring task from a Truth or Dare generator via REST API
                // the result is in JSON format, so I'll extract just the text
                do {
                    $.ajax({
                        url: 'https://truthordare-game.com/api/dare/15',
                        dataType: 'json',
                        async: false,
                        success: function (data) {
                            currentID = data.id;
                            listItem = data.text;
                        }
                    });
                    //check if the "task" has already been used this test run
                } while (alreadyDoneIDs.indexOf(currentID) > -1);
                alreadyDoneIDs.push(currentID);
            }

            //write the task into the new task field
            this.api.setValue(repo.newTaskField, [listItem, this.api.Keys.ENTER]);

            //validate that the task has been successfully created and added to the task list
            this.api
                .waitForElementVisible(repo.mostRecentTask)
                .assert.containsText(repo.mostRecentTask + '//span', listItem);
        }

        //let's also check that we've added the correct number of items
        let browser = this.api;
        browser.elements('xpath', repo.allToDoTasks, function (result) {
            browser.assert.equal(result.value.length, noOfItems);
        });
    },



    // markAsDone: function (howMany) {
    //     let totalItems=0;
    //     let howManyItems = 0;
    //     if (howMany===undefined) {
    //         howManyItems = 0;
    //     }
    //     else howManyItems = howMany;
    //     let browser = this.api;
    //     browser.elements('xpath', repo.allToDoTasks, function (result) {
    //         totalItems= result.value.length;
    //
    //         console.log(browser.getAttributeByName(result.value[0], 'innertext'));
    //         while (howManyItems===0||howManyItems>totalItems){
    //             howManyItems = Math.floor(Math.random()*10);
    //         };
    //         let liIDArray=[];
    //         for (let i =0; i<howManyItems;i++){
    //             liIDArray.push(i);
    //         }
    //     });
    // }

};
module.exports = {
    commands: [todomeCommands]
};