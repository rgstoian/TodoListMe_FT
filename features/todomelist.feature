Feature: ToDoMeList Test Suite

  Scenario: Searching Google

    Given I open Google's search page
    Then the title is "Google"
    And the Google search form exists

#  Scenario: Add single to do list item
#    Given the user is on the to do list page
#    When the user adds a to do list item
#    Then the item shows up as a to do list item
#
#  Scenario: Add multiple to do list items
#    Given the user is on the to do list page
#    When the user adds more than 1 to do list items
#    Then the items shows up as a to do list items
#
#  Scenario: Mark a to do list item as done
#    Given the user is on the to do list page
#    When the user marks a to do list item as done
#    Then the to do list item is marked as done
#
#  Scenario: Mark multiple items as done
#    Given the user is on the to do list page
#    And there are at least 10 to do items
#    When the user marks 5 to do items as done
#    Then the marked to do list items are marked as done
#
#  Scenario: Check the progress bar
#    Given the user is on the to do list page
#    And there are exactly 10 to do list items
#    When the user marks 5 to do list items as done
#    Then the progress bar should be at 50%