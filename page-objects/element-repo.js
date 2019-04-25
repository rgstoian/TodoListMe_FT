module.exports= {
    slogan: '//span[@id=\'slogan\']',

    //region loginElements
    syncWithServerButton: '//button[contains(text(), \'Overwrite lists\')]',
    loginStatus: '//span[@id=\'loggedinas\']',
    username: 'todolisttest@maillink.live',
    password: 'P@ssw0rd1',
    syncPanelButton: '//a[descendant::img[@title=\'Sync lists to server\']]',
    syncPanel: '//div[@id=\'syncform\']',
    usernameField: '//input[@id=\'syncname\']',
    passwordField: '//input[@id=\'syncpassword\']',
    syncButton: '//input[@id=\'syncbutton\']',
    closeSyncPanelButton: '//div[@id=\'syncformup\']/a[.=\'Close panel\']',

    //endregion

    newListButton: '//img[@id=\'addlist\']',
    newListNameField: '//input[@id=\'updatebox\']',
    newListSaveButton: '//div[@id=\'inplaceeditor\']//input[@value=\'Save\']',

    currentListButton: '//li[child::span[contains(text(), \'\')]]',
    blankListButton: '//li[child::span[contains(text(), \'Blank\')]]',

    syncIcon: '//img[@id=\'sync_icon\' and @title=\'Lists synced\']',
    newTaskField: '//input[@id=\'newtodo\']',
    mostRecentTask:'//ul[@id=\'mytodos\']//li[last()]',
    allToDoTasks: '//ul[@id=\'mytodos\']//li',


    currentDateTime: new Date().toISOString()

}
