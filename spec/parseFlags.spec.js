var Cli = require('../cli')
  , cli = new Cli()
  
  , testFunc = function() {
    return cli.parseFlags(arguments);
  };

describe('parseFlags', function() {
  
  it('should parse flags', function() {
    
    var map = testFunc('-p', 8181);
    
    expect(map).toEqual({p:8181});
    
  });
  
});