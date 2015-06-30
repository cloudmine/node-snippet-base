# Example CloudMine Server Code Snippet

This is a example of how to structure your project for running on CloudMine's dynamic cloud dispatch.

The `lib` folder has snippets which are just pieces of node code. The `index.js` has the important parts of the code.

1) The module.exports must come before the `.start` method is called. The exports of a file are dynamic and can be changed at any point - running code after the exports is fine. In this case, we need to define the snippets you want to enable for public consumption.

2) `CloudMineNode.start` is called, which creates the HTTP server to host your requests. It requires the current scope, the root file, and has a callback to let you know when things are working.
