# type-based-execution

```
npm install type-based-execution --save
```

The module can be used to force your application to handle specific datatypes in different ways, for instance reject everything except for strings.

```javascript
var tbe = require('type-based-execution');

var chain = new tbe.Chain();
// Strings will be printed on console
chain.setCallback("", function(err, res){
    console.log(res);
});
chain.handle(undefined);
chain.handle(null);
chain.handle(true);
chain.handle(0);
chain.handle("hello world");
chain.handle(["abc", 123]);
chain.handle({});
```
Console output:
```
hello world
```
## Process chain

The module already comes with a simple process chain. If one of these checks shown below is successful the corresponding callback function is being called.

![example_process_chain](https://cloud.githubusercontent.com/assets/25703985/23181255/93798bd0-f874-11e6-89f9-00e1e6c0e931.png)

## Create your own process chain
One can easily create own process chains, for instance only allow arrays and objects.
```javascript
var forwardOnSuccess = false;
var root = new tbe.ArrayProcessor(forwardOnSuccess);
root.add(new tbe.ObjectProcessor(forwardOnSuccess));
root.setCallback([], function(err, res){
    console.log("Parameter was an array: " + res);
});
root.setCallback({}, function(err, res){
    console.log("Parameter was an object: " + res);
});
```
Which is equivalent to:
```javascript
var forwardOnSuccess = false;
var root = new tbe.ArrayProcessor(forwardOnSuccess);
var next = new tbe.ObjectProcessor(forwardOnSuccess);
root.add(next);
root.Callback = function(err, res){
    console.log("Parameter was an array: " + res);
};
next.Callback = function(err, res){
    console.log("Parameter was an object: " + res);
};
```
Please note that, if 'forwardOnSuccess' is defined multiple processors might call their callback function. For instance, arrays are also treated as objects. At the moment the module does not use promisses which means that no one can say which callback function finishes first.

![user_defined_process_chain](https://cloud.githubusercontent.com/assets/25703985/23181303/c7333778-f874-11e6-8372-ce9c907b7166.png)

Additionally one can define subclasses of 'BaseProcessor' to create further process chains, e.g.:
```javascript
"use strict";

var _ = require('underscore');
var tbe = require('type-based-execution');

...

class IpProcessor extends tbe.BaseProcessor
{   
    constructor(forwardOnSuccess) {
        super(forwardOnSuccess);
        this.Callback = function(err, res){console.log("Input string matches IP address pattern");};
    }
    
    isTypeOf(value)
    {
        return (_.isString(value) && value.match(/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/));
    }
}

...

root.add(new IpProcessor());
```
Do not forget to add `"use strict";` on top of your javascript files when defining own classes!

## Summary

The activity diagram below describes the process chain.

![activity_diagram](https://cloud.githubusercontent.com/assets/25703985/23181294/bfb703bc-f874-11e6-9391-82fca6cab98d.png)

## Future release plan

+ 'isTypeOf' will be renamed into 'accept' (next major release)
