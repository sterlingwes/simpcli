var Cli = require('../cli');

describe('cli constructor', function() {
  
  it('should add start() if only flags given', function() {
    
    var cmd = "node ph -p".split(/\s/)
      , cli = new Cli(null, null, {argv:cmd});
    
    expect(cli.args.length - cli.flags.length).toEqual(1); // added start
    expect(cli.args.length).toEqual(2); // includes start & -p
    expect(cli.args[0]).toEqual('start');
    expect(cli.flags.length).toEqual(1);
    
  });
  
});