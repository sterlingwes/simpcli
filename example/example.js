var Cli = require('../cli')
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

cli.chain.then(function() {
    cli.print('Done.');
})
.catch(function(err) {
    cli.print('Oops!', err);
});