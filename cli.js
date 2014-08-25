var PromiseApi = require('es6-promise')
  , Promise = PromiseApi.Promise
  , exec = require('child_process').exec
  , spawn = require('win-spawn')
  , path = require('path');

/*
 * our main run()
 */
function Cli(argList, flags) {
  if(!argList) argList = {};
  this.addDefaults(argList);
  this.args = process.argv.slice(2);
  
  if(!this.args.length)
    this.args.push('start'); // default to using start()
  
  this.tasks = this.args.map(function(arg, idx) {
    // iterate each argument and determine if an object or a function
    
    if(arg.indexOf('-')===0)
      return false; // ignore flags, looking for tasks to run first
    
    var tdef = argList[arg],
        // if an object, clone otherwise mark as function or return that it doesn't exist (false)
        task = tdef && typeof tdef === 'object' 
                ? Object.create(argList[arg]) 
                : ( typeof tdef === 'function' ? { fn: tdef } : false );
    if(task) {
        task.name = arg;
        task.pos = idx;
    }
    return task;
    
  }).filter(function(task) { return !!task; }); // filter out any marked false
  
  // now we grab any flags in our args
  this.flags = this.args.filter(function(arg) {
      return arg.indexOf('-')===0;
  });
  
  this.argList = argList;
  this.flagList = flags;
  this.runCount = 0;
  
  // this promise holds our task chain
  var promise = Promise.resolve();

  // iterate over each task and run
  this.chain = this.tasks.reduce(function(sequence, task) {
      return sequence.then(function(last) {
          return this.runTask(task);
      }.bind(this));
  }.bind(this), promise);
  
  // if nothing was run, should handle that
  this.chain.then(function() {
    if(!this.runCount)
      this.print('No matching commands could be found for "'+ this.args.join(' ')+'"');
  }.bind(this));
}

/*
 * getArgs() - currently slices cmdline args, will handle chaining soon
 */
Cli.prototype.getArgs = function(pos) {
  var args = this.args.slice(pos+1)
    , foundOther = false;

  return args.filter(function(arg) {
      //if(this.argList[arg])   foundOther = true;
      return !foundOther && arg;
  }.bind(this));
};

/*
 * parseFlags() - returns an object mapping of flags to values (without the dash - and all lowercase)
 */
Cli.prototype.parseFlags = function(args) {
  args = [].slice.call(args,0);
  var map = {}
    , last;
  
  args.forEach(function(a) {
    if(/^\-\-/.test(a)) { // longform
      last = a.substr(2).toLowerCase();
      map[last] = true;
    }
    else if(/^\-/.test(a)) { // shortform
      last = a.substr(1).toLowerCase();
      map[last] = true;
    }
    else
      map[last] = a; // set value
  });
  
  return map;
};

/*
 * defer() - shorthand for using promises within task functions
 */
Cli.prototype.defer = function(resolver) {
  return new Promise(resolver);
};

/*
 * exec() & spawn() refs for running other commands
 */
Cli.prototype.exec = exec;
Cli.prototype.spawn = spawn;

/*
 * addDefaults() - checks whether start() and help() exists, adds default help method
 */
Cli.prototype.addDefaults = function(spec) {
  if(!spec.start) spec.start = function() {};
  if(!spec.help) spec.help = function() { this.printCommands(); }.bind(this);
};

/*
 * runTask() - runs individual commands
 */
Cli.prototype.runTask = function(taskCfg) {
  var args = this.getArgs(taskCfg.pos); // grab any cmdline params for our task and run with
  if(taskCfg.fn) this.runCount++;
  return taskCfg.fn ? taskCfg.fn.apply(this, args) : console.warn('Invalid taskCfg '+taskCfg.name);
};

/*
 * printCommands() - lists defined commands along with any provided info
 */
Cli.prototype.printCommands = function() {
  this.print('Available Commands:');
  for(var arg in this.argList) {
    var spec = this.argList[arg];
    this.print('- ' + arg + (typeof spec.about === 'string' ? ': '+spec.about : ''));
  }
};

/*
 * print() currently delegates to console, will add colours and formatting in the future
 */
Cli.prototype.print = function() {
  console.log.apply(console, [].slice.call(arguments,0));
};

module.exports = Cli;