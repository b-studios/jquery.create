(function(globals) {
  
  module("Utils", {
  
    setup: function() {
      globals.FOO = {
        bar: {
          baz: 5
        }
      }
    },

    teardown: function() {
      delete globals.FOO;
    }

  });


  test("Resolve", function() {   
  
    equal($.resolve('FOO.bar.baz'), 5);
    strictEqual($.resolve('FOO.bar'), FOO.bar);
    strictEqual($.resolve('FOO.bar.boo', true), FOO.bar.boo);

  });

  
  test("Define", function() {   
    
    var some_object = {};    

    $.define('FOO.bar.baz', some_object);
    strictEqual(FOO.bar.baz, some_object);
  
    $.define('FOO.moo.foo', some_object);
    strictEqual(FOO.moo.foo, some_object);

  });

  test("Symbols", function() {

    var foobar = $.sym('foobar'),
        mooboo = $.sym('mooboo');

    strictEqual($.sym('foobar'), foobar);
    strictEqual($.sym('foobar'), $.sym('foobar'));
    
    strictEqual($.sym('mooboo'), mooboo);
    strictEqual($.sym('mooboo'), $.sym('mooboo'));
    
    notStrictEqual(foobar, mooboo);
    notStrictEqual($.sym('foobar'), $.sym('mooboo'));
  });

})(this);
