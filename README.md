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

This is a example of how to structure your project for running on CloudMine's PaaS.

The `lib` folder has snippets which are just pieces of node code. The `index.js` has the important parts of the code.

## Getting Started

1. In `index.js`, the `module.exports` call **must** occur before the `.start` method is called, otherwise Apollo will not be able to identify public snippets available for invocation.
2. `CloudMineNode.start` requires the current scope, the root file, and has a callback to let you know when the package is ready for inbound requests.

## Running Snippets Locally

In order to run your CloudMine Snippets locally, please follow the below instructions.

1. Ensure that all NPM module dependencies are defined in `package.json`. 
2. Run `npm install` from the root directory to ensure that the dependencies are included into the project. 
3. Next, run `node index.js` to start the server.
4. Finally, `curl`, `wget`, or use your favorite method of running HTTP commands using the below examples.

#### Obtain a Listing of Available Snippets

Request: 

`localhost:4545/names`

Response: 

`["basic","async"]`

#### Executing a Snippet
 
Request:

`localhost:4545/code/basic`

Response:

`{"success":"Basic was called"}`
 
# Implementation Notes

Historically, CloudMine snippets use the `data` environment variable, and the `exit` function in order to reply to inbound requests. With Apollo, both a new environment variable and exit function will be introduces: `req` and `reply`, respectively.


### 1. Accessing environment details via the `req` variable

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
  session_token: '6c160b8140fc43e28ff9bf7bb00f198e' }
```

#### Cloud or Local Environment

Note that `process.env.CLOUDMINE` may be used to determine whether the code is running locally (false) or in the CloudMine Apollo PaaS environment (true). Example usage is below:

```
var isCloud = process.env.CLOUDMINE;

if(isCloud){
    console.log("IsCloud!");
    //Configure appropriate environment details
}
else{
    console.log("IsLocal!");
    //Configure appropriate environment details
}
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

### 3. Controlling the Snippet Response

There are options that can be used to control the response from the snippet beyond the `reply` interface.

#### Using the `unwrap_result` query param

By specifying `unwrap_result=true` in the query string of the snippet execution request, the output of the snippet will not be wrapped in a `result` attribute.

Suppose you have a snippet that calls `reply('I called a snippet!')` to complete execution. With the default behavior the response payload would be:

```
{
  "result": "I called a snippet!"
}
```

By specifying `unwrap_result=true` in the query string of the snippet request the response payload will become:

```
I called a snippet!
```

#### Setting the `Accept` Header

The `Accept` header can be used in the snippet execution request to change the `Content-Type` header of the response as well as the format of the payload. There are two supported values for the `Accept` header:
1. text/plain
2. application/xml

If `text/plain` is used, the payload does not change as all json payloads are already delivered as text, but the `Content-Type` on the response will be set to `text/plain`.

If `application/xml` is used the payload will be converted to XML based on the rules below, and the `Content-Type` on the response will be set to `application/xml`.

Any other value in the `Accept` header will be ignored and the `Content-Type` on the response will be `application/json`.

##### JSON to XML Conversion Rules

1. Object property names will become XML tags that wrap the value of that property
2. Properties will values null, undefined, or empty string will be represented with an empty tag (e.g. `<Name/>`)
3. Each element in an array will be wrapped in an `<element>` tag
#
##### JSON to XML Conversion Example

If you would have received a JSON response such as:
```
{
  result: {
    str: "a string",
    bool: true,
    num: 1289,
    arr: ['uno', 2, false],
    empty: '',
    undef: undefined
  }
}
```
as XML it would become:
```
<?xml version="1.0" encoding="UTF-8" ?>
<result>
  <str>a string</str>
  <bool>true</bool>
  <num>1289</num>
  <arr>
    <element>uno</element>
    <element>2</element>
    <element>false</element>
  </arr>
  <empty/>
  <undef/>
</result>
```

#### Combining `unwrap_result` and the Accept Header

The `unwrap_result` query param and the `Accept` header can be combined to have any plain text response that you would like. For example, if you would like to create an XML output that does not use the same rules as described above you could build this XML as a string in the snippet. If you pass the `unwrap_result` query param to the request and simultaneously specify `application/xml` or `text/plain` in the `Accept` header you will receive the exact XML string you output in your snippet. Note that if your snippet output is any non-object, non-array value and `application/xml` is specified in the `Accept` header, no transformation or validation will be done on the value. CloudMine assumes you are doing this purposefully and it is up to you to ensure the XML is valid.


### 4. Preparing the ZIP Package for CloudMine

When uploading your ZIP package to CloudMine's servers, please be sure that:

* the `node_modules` folder is removed, and
* all `.git` files are removed

To help with this process, we have included a ZIP CLI example below:

`zip -r code.zip code-folder/ -x *.git* -x *node_modules*`

**Notes**

1. `code.zip` refers to the final package name
2. `code-folder` refers to the root folder of the package
