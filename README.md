# Simpcli - A Simple Cli!

## Usage

Just instantiate with a mapping of argument names to handler functions.

```javascript
var Cli = require('simpcli')
  , cli = new Cli({
  
    // the start command is run by default if only the cli is called (no args)
    
    start: function() {
        this.print('I did something useful');
    },
    
    help: function(arg) {
        if(!arg)    arg = 'something';
        this.print('Need help with %s? Too bad.', arg);
    }
    
  });
  
```

```
> mycli
I did something useful

> mycli help
Need help with something? Too bad.

> mycli help life
Need help with life? Too bad.
```

## API

This module exports an object prototype that you instantiate. Each instance can use the following (on the `cli` instance or from within argument handler functions using the context, `this`):

### chain *property (Promise)*

Allows access to the [Promise](https://github.com/jakearchibald/es6-promise#readme) chain used in coordinating async tasks. For instance,

```javascript
cli.chain.then(function() {
    // do something after the Cli executes the described commands
})
.catch(function(err) {
    // catch exceptions thrown in the promise chain
});
```

### print() *method*

Console.log alias. Will allow for better display control.

### defer(resolver)

Where `resolver` is a function with `resolve` and `reject` arguments per the [Promise API](https://github.com/jakearchibald/es6-promise#readme). Shorthand to avoid using a separate promises library for your implementation.

### exec()

See [Node child_process docs](http://nodejs.org/docs/latest/api/child_process.html#child_process_child_process_exec_command_options_callback).

## Todo

*   Argument chaining
*   Flag 'hook' support
*   Object definitions for arguments
*   Use ES6 promises within Node to remove all dependencies
*   Colours and other useless but fun things

### License

MIT