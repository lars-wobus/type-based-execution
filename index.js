"use strict";

var _ = require('underscore');

/**
 * Base class.
 */
class BaseProcessor
{
    /**
     * Constructor
     * @param {Boolean} forwardOnSuccess - flag to enable processing values by multiple handlers
     */
    constructor(forwardOnSuccess) {
        this.nextProcessor = undefined;
        this.Callback = undefined;
        this.informNextProcessor = forwardOnSuccess || false;
    }
    
    /**
     * Add another handler to the end of the process chain
     * @param {Object} processor - subclass of BaseProcessor
     */
    add(processor)
    {
        if(this.nextProcessor)
        {
            this.nextProcessor.add(processor);
        }
        else
        {
            this.nextProcessor = processor;
        }
    }
    
    /**
     * Start processing the value and/or inform the next handler in process chain.
     * @param {} value - any value type
     */
    handle(value)
    {
        if(this.isTypeOf && this.isTypeOf(value))
        {
            if(this.Callback)
            {
                this.Callback(null, value);
            }
            if(this.informNextProcessor && this.nextProcessor)
            {
                this.nextProcessor.handle(value);
            }
        }
        else
        {
            if(this.nextProcessor)
            {
                this.nextProcessor.handle(value);
            }
        }
    }
    
    /**
     * Update the callback function of one of its relatives which feels responsible for the given datatype.
     */
    setCallback(value, cb)
    {
        if(this.isTypeOf && this.isTypeOf(value))
        {
            this.Callback = cb;
        }
        else
        {
            if(this.nextProcessor)
            {
                this.nextProcessor.setCallback(value, cb);
            }
        }
    }
}

/**
 * Executes callback function when function parameter is undefined. 
 */
class UndefinedProcessor extends BaseProcessor
{    
    constructor(forwardOnSuccess) {
        super(forwardOnSuccess);
        this.isTypeOf = _.isUndefined;
    }
}

/**
 * Executes callback function when function parameter is null.
 */
class NullProcessor extends BaseProcessor
{    
    constructor(forwardOnSuccess) {
        super(forwardOnSuccess);
        this.isTypeOf = _.isNull;
    }
}

/**
 * Executes callback function when function parameter is a boolean.
 */
class BooleanProcessor extends BaseProcessor
{     
    constructor(forwardOnSuccess) {
        super(forwardOnSuccess);
        this.isTypeOf = _.isBoolean;
    }
}

/**
 * Executes callback function when function parameter is a number.
 */
class NumberProcessor extends BaseProcessor
{   
    constructor(forwardOnSuccess) {
        super(forwardOnSuccess);
        this.isTypeOf = _.isNumber;
    }
}

/**
 * Executes callback function when function parameter is a string.
 */
class StringProcessor extends BaseProcessor
{       
    constructor(forwardOnSuccess) {
        super(forwardOnSuccess);
        this.isTypeOf = _.isString;
    }
}

/**
 * Executes callback function when function parameter is an array.
 */
class ArrayProcessor extends BaseProcessor
{     
    constructor(forwardOnSuccess) {
        super(forwardOnSuccess);
        this.isTypeOf = _.isArray;
    }
}

/**
 * Executes callback function when function parameter is an object.
 */
class ObjectProcessor extends BaseProcessor
{   
    constructor(forwardOnSuccess) {
        super(forwardOnSuccess);
        this.isTypeOf = _.isObject;
    }
}

/**
 * Predefined process chain.
 */
class ProcessChain
{
    constructor(forwardOnSuccess) {
        this.root = new UndefinedProcessor(forwardOnSuccess);
        this.root.add(new NullProcessor(forwardOnSuccess));
        this.root.add(new BooleanProcessor(forwardOnSuccess));
        this.root.add(new NumberProcessor(forwardOnSuccess));
        this.root.add(new StringProcessor(forwardOnSuccess));
        this.root.add(new ArrayProcessor(forwardOnSuccess));
        this.root.add(new ObjectProcessor(forwardOnSuccess));
    }
    
    add(processor)
    {
        this.root.add(processor);
    }
    
    handle(value)
    {   
        this.root.handle(value);
    }
    
    setCallback(value, cb)
    {
        this.root.setCallback(value, cb);
    }
}

module.exports = 
{
    Chain: ProcessChain,
    
    ArrayProcessor: ArrayProcessor,
    BaseProcessor: BaseProcessor,
    BooleanProcessor: BooleanProcessor,
    NullProcessor: NullProcessor,
    NumberProcessor: NumberProcessor,
    ObjectProcessor: ObjectProcessor,
    StringProcessor: StringProcessor,
    UndefinedProcessor: UndefinedProcessor
}
