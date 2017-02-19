"use strict";

var assert = require('assert');
var _ = require('underscore');

var tbe = require('../index.js');

describe('Test pre-defined process chain', function() {
    
    var tests = [
        {args: [undefined]},
        {args: [null]},
        {args: [false]},
        {args: [0]},
        {args: ["hello world"]},
        {args: [["abc", 1]]},
        {args: [{}]}
    ];
    
    tests.forEach(function(test) {
        it('Check if process chain handles: ' + test.args[0], function(done) {
            var chain = new tbe.Chain(false);
            chain.setCallback(test.args[0], function(err, res){
                done();
            });
            chain.handle(test.args[0]);
        });
    });
});

describe('Test user-defined process chain', function() {
    
    var tests = [
        {args: [0]},
        {args: ["127.0.0.1"]}
    ];
    
    var root = new tbe.NumberProcessor(false);
    
    class IpProcessor extends tbe.BaseProcessor
    {   
        constructor() {
            super();
        }

        isTypeOf(value)
        {
            return (_.isString(value) && value.match(/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/))
        }
    }

    root.add(new IpProcessor(false));
    
    tests.forEach(function(test) {
        it('Check if process chain handles: ' + test.args[0], function(done) {
            root.setCallback(test.args[0], function(err, res){
                done();
            });
            root.handle(test.args[0]);
        });
    });
});

describe('Test if multiple handlers can start their process', function() {
    this.slow(10000);
    var chain = new tbe.Chain(true);
    var counter = 0;
    chain.setCallback([], function(err, res){
        counter++;
    });
    
    chain.setCallback({}, function(err, res){
        counter++;
    });
    
    it('Check if array is processed by both ArrayProcessor and ObjectProcessor', function(done) {
        chain.handle([]);
        while(counter < 2){}
        done();
    });
});