var PromiseApi = require('es6-promise')
  , Promise = PromiseApi.Promise
  , exec = require('child_process').exec
  , path = require('path');

function Cli(argList, flags) {
    this.args = process.argv.slice(2);
    
    if(!this.args.length)
        this.args.push('help');
    
    this.tasks = this.args.map(function(arg, idx) {
        var tdef = argList[arg],
            task = tdef && typeof tdef === 'object' 
                    ? Object.create(argList[arg]) 
                    : ( typeof tdef === 'function' ? { fn: tdef } : false );
        if(task) {
            task.name = arg;
            task.pos = idx;
        }
        return task;
        
    }).filter(function(task) { return !!task; });
    
    this.flags = this.args.filter(function(arg) {
        return arg.indexOf('-')==0;
    });
    
    this.argList = argList;
    this.flagList = flags;
    
    var promise = Promise.resolve();

    this.chain = this.tasks.reduce(function(sequence, task) {
        return sequence.then(function(last) {
            return this.runTask(task);
        }.bind(this));
    }.bind(this), promise);
}

Cli.prototype.getArgs = function(pos) {
    var args = this.args.slice(pos+1)
      , foundOther = false;

    return args.filter(function(arg) {
        if(this.argList[arg])   foundOther = true;
        return !foundOther && arg;
    }.bind(this));
};

Cli.prototype.defer = function(resolver) {
    return new Promise(resolver);
};

Cli.prototype.exec = exec;

Cli.prototype.runTask = function(taskCfg) {
    var args = this.getArgs(taskCfg.pos);
    return taskCfg.fn ? taskCfg.fn.apply(this, args) : console.warn('Invalid taskCfg '+taskCfg.name);
};
    
Cli.prototype.print = function() {
    console.log.apply(console, [].slice.call(arguments,0));
};

module.exports = Cli;