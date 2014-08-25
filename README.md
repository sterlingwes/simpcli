# Simpcli - A Simple Cli!

## Usage

Just instantiate with a mapping of argument names to handler functions.

```javascript
#! /usr/bin/env node
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

Ensure you add the `bin` property to your `package.json` in order gain access to your cli.

```
{...
    "bin": {
        "mycli":    "./cli.js"
    }
...}
```

You may need to run `npm link` from that directory if you did not install your module globally.

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

### parseFlags() *method*

Takes the raw arguments passed to your argument handler and converts them to an object mapping. For example, `mycli start -p 8181` with the following handler:

```
start: function() {
  var flags = this.parseFlags(arguments);
  console.log(flags);
}
```

Would print `{ p: 8181 }` in the console.

A flag without a value would yield a `true` boolean value. Flags preceded by double dashes are also supported for long form flags (`--port`).

### print() *method*

Console.log alias. Will allow for better display control.

### defer(resolver)

Where `resolver` is a function with `resolve` and `reject` arguments per the [Promise API](https://github.com/jakearchibald/es6-promise#readme). Shorthand to avoid using a separate promises library for your implementation.

### exec()

See [Node child_process docs](http://nodejs.org/docs/latest/api/child_process.html#child_process_child_process_exec_command_options_callback).

### spawn()

See [win-spawn](http://npmjs.org/package/win-spawn).

## Todo

*   Argument chaining
*   Flag 'hook' support
*   Object definitions for arguments
*   Use ES6 promises within Node to remove dependency
*   Colours and other useless but fun things

### License

MIT