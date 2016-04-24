<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
# Table of Contents

- [Example CloudMine Server Code Snippet](#example-cloudmine-server-code-snippet)
  - [Getting Started](#getting-started)
  - [Running Snippets Locally](#running-snippets-locally)
      - [Obtain a Listing of Available Snippets](#obtain-a-listing-of-available-snippets)
      - [Executing a Snippet](#executing-a-snippet)
- [Implementation Notes](#implementation-notes)
    - [1. Accessing environment details via the `req	` variable](#1-accessing-environment-details-via-the-req%09-variable)
      - [Request Verb](#request-verb)
      - [Request Body](#request-body)
      - [Query String](#query-string)
      - [Session Data](#session-data)
      - [Cloud or Local Environment](#cloud-or-local-environment)
    - [2. Replying to API requests via the `reply` function](#2-replying-to-api-requests-via-the-reply-function)
      - [Replying with a String or Integer](#replying-with-a-string-or-integer)
      - [Replying with a JSON Object](#replying-with-a-json-object)
    - [3. Preparing the ZIP Package for CloudMine](#3-preparing-the-zip-package-for-cloudmine)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Example CloudMine Server Code Snippet

This is an example of how to structure your NodeJS project for deployment and execution on CloudMine's Logic Engine.

The `lib` folder contains Snippets which are just pieces of NodeJS code. The `index.js` file is responsible for starting a mini-web server which routes inbound Snippet requests, as well as collating and exposing the named methods which form the basis of your CloudMine API. 

## Getting Started

1. In `index.js`, the `module.exports` call **must** occur before the `.start` method is called, otherwise Logic Engine will not be able to identify public snippets available for invocation.
2. `CloudMineNode.start` requires the current scope, the root file, and has a callback to let you know when the package is ready for inbound requests.

## Running Snippets Locally

In order to run your CloudMine Snippets locally, please follow the below instructions: 

1. Ensure that all NPM module dependencies are defined in `package.json`. 
2. Run `npm install` from the root directory to ensure that the dependencies are included into the project. 
3. Next, run `npm run local` or `npm run server` to start the server in local test mode.
4. Finally, `curl`, `wget`, or use your favorite method of running HTTP commands using the below examples.

#### Obtain a Listing of Available Snippets

Request: 

`localhost:4545/names`

Response: 

`["basic","async"]`

#### Executing a Snippet
 
Request:

`localhost:4545/v1/app/{appid}/run/basic`

Response:

`{"success":"Basic was called"}`
 
# Implementation Notes

Historically, CloudMine snippets use the `data` environment variable, and the `exit` function in order to reply to inbound requests. With Logic Engine, both a new environment variable and exit function are included: `req` and `reply`, respectively.


### 1. Accessing environment details via the `req	` variable

#### Request Verb
```
console.log(req.payload.request.method);
```
Output:

```
POST
```

#### Request Body
```
console.log(req.payload.request.body);
```
Output:

```
{ objId: { key1: 'value1', key2: 'value2' } }
```

#### Query String
```
console.log(req.payload.params);
```
Output:

```
{ objId: { key1: 'param1', key2: 'param2' },
  queryStringParam1: 'queryStringValue1',
  queryStringParam2: 'queryStringValue2' }
```

#### Session Data

```
console.log(req.payload.session)
```
Output:

```
{ api_key: '4fb3caf6fa53442fb921dd93ae0c98e6',
  app_id: '3f4501961d62bc4eb388d9dc6dfdd1e5',
  session_token: '6c160b8140fc43e28ff9bf7bb00f198e',
  user_id: 'bd027836e4744391ba2aabf6aacdc828' }
```

**Note:** in order for the `session_token` and `user_id` values to populate, the `X-CloudMine-SessionToken` request header must be present in the original request and the `session_token` must be valid.

#### Cloud or Local Environment

`process.env.CLOUDMINE` may be used to determine whether the code is running locally (false) or in the CloudMine Logic Engine environment (true). Example usage is below:

```
var isCloud = process.env.CLOUDMINE;

var local_config = {};
local_config = {
	"api_key":"localEnvApiKey",
	"app_id":"localAppId"
};

var ApiKey = isCloud ? req.payload.session.api_key : local_config.api_key;
var AppId = isCloud ? req.payload.session.app_id : local_config.app_id;
```

### 2. Replying to API requests via the `reply` function

There are two types of values that may be passed into the `reply` function: Strings and Ints as well as JSON objects. 

#### Replying with a String or Integer 

When using the `reply` function with only a `String` or `Integer`, the value will be returned as part of the `result` key. 

Example:

```
var a = 6;
reply(a);
```
or

```
var b = "This is a string!";
reply(b);
```

Output:

```
{
  "result": 6
}
```
or

```
{
  "result": "This is a string!"
}
```

#### Replying with a JSON Object 

When replying with a JSON shape, the contents of the object will be nested within the `result` shape. 

Example:

```
setTimeout(function() {
    reply({text: 'This took 5 seconds!'});
  }, 5000);
```

Output:

```
{
  "result": {
    "text": "This took 5 seconds!"
  }
}
```

### 3. Preparing the ZIP Package for CloudMine

When uploading your ZIP package to CloudMine's servers, please be sure that:

* the `node_modules` folder is removed, and
* all `.git` files are removed

To help with this process, we have included a ZIP CLI example below:

`zip -r code.zip code-folder/ -x *.git* -x *node_modules*`

**Notes**

1. `code.zip` refers to the final package name
2. `code-folder` refers to the root folder of the package
