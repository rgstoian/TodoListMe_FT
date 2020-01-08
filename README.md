# Automated test assignment using Javascript and NightwatchJS

## About

A previously completed test assignment, done in JavaScript (Node.js), created with Intellij Webstorm, using Nightwatch.js and ChromeDriver. Functional in both normal and headless mode.

The test application performs several tests on a simple to-do list web application, located at [http://todolistme.net](http://todolistme.net). Test runs are saved via the site's account feature, using a disposable e-mail address.

The following test cases are implemented:

- **Scenario** : Add single to do list item
>
>	**Given** the user is on the to do list page
>
>**When** the user adds a to do list item
>
>	**Then** the item shows up as a to do list item

- **Scenario** : Add multiple to do list items

>**Given** the user is on the to do list page
>
>**When** the user adds more than 1 to do list items
>
>**Then** the items shows up as a to do list items

- **Scenario** : Mark a to do list item as done
>
>**Given** the user is on the to do list page
>
>**When** the user marks a to do list item as done
>
>**Then** the to do list item is marked as done

- **Scenario** : Mark multiple items as done
>
>**Given** the user is on the to do list page
>
>**And** there are at least 10 to do items
>
>**When** the user marks 5 to do items as done
>
>**Then** the marked to do list items are marked as done

- **Scenario** : Check the progress bar
>
>**Given** the user is on the to do list page
>
>**And** there are exactly 10 to do list items
>
>**When** the user marks 5 to do list items as done
>
>**Then** the progress bar should be at 50%

## Thoughts and Challenges

Coming from C#, JavaScript at a first glance looks very messy, at least from a testing perspective. Dynamic typing just makes keeping track of objects harder, and asynchronous execution is completely unnecessary for tests which imitate user behaviour. Even though this is just my personal opinion and I am aware that "fixes" such as Typescript exist, it all feels like unnecessary busywork.

While JavaScript and Node.js have their merits, NightwatchJS does not feel as a stable testing framework due to its numerous issues I've encountered:

- It's not functional on Windows with the default configuration: [https://github.com/nightwatchjs/nightwatch/issues/1992](https://github.com/nightwatchjs/nightwatch/issues/1992)
- It's asynchronous, with a peculiar order in executing events. Furthermore, this is not mentioned anywhere on the main website, but instead in a wiki article on the project's GitHub: [https://github.com/nightwatchjs/nightwatch/wiki/Understanding-the-Command-Queue](https://github.com/nightwatchjs/nightwatch/wiki/Understanding-the-Command-Queue) . Using async and await lead to strange behavior (commands being executed completely out of order).
- It's almost impossible to debug from a classical point of view. Due to its asynchronous nature, simply putting a breakpoint inside a method will pause the execution of the entire method. Using their recommended way of setting a breakpoint also hampers variable watching inside an IDE.
- The documentation is incomplete and even incorrect in places. Most, if not all methods regarding elements in the API Reference (starting with [http://nightwatchjs.org/api#getElementSize](http://nightwatchjs.org/api#getElementSize)) do not in fact return anything. In fact, every method I've tried only passes the desired return value to the callback function, which is volatile. Even though reported, the issue was closed without resolution: [https://github.com/nightwatchjs/nightwatch/issues/327](https://github.com/nightwatchjs/nightwatch/issues/327)
- Using callback methods for returning element properties and values also leads to callback chaining, going one more level deep for every property retrieved from an element. Using their recommended workaround, the perform() method, just rearranges the callback chain.
- Selectors are limited to CSS and Xpath, with the exception of the element() and elements() methods. Furthermore, the selector type needs to be specified to the framework, an issue still to be resolved: [https://github.com/nightwatchjs/nightwatch/issues/196](https://github.com/nightwatchjs/nightwatch/issues/196) . Because of this, I've resorted to only using Xpath selectors in my test suite. (Note: the documentation is again incorrect, as the selector parameter in many methods is specified to be CSS-only, while Xpath is also an option, see [http://nightwatchjs.org/api#assert-urlEquals](http://nightwatchjs.org/api#assert-urlEquals) and below)
- Disabling testcases is not supported: [https://github.com/nightwatchjs/nightwatch-docs/blob/master/guide/running-tests/disabling-tests.md](https://github.com/nightwatchjs/nightwatch-docs/blob/master/guide/running-tests/disabling-tests.md)
- It heavily relies on arguments passed as strings or commands which aren't revealed by the code completion functionality of many editors; the only one I've managed to get code completion/Intellisense working with was Intellij Ultimate/Webstorm.# Automated test assignment using Javascript and NightwatchJS
