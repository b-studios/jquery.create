(function() {
  
  module("Mixins", {

    setup: function() {
    
        
      jQuery.create('Greeter', {
        say_hello: function() { return "Hello World again"; }
      });
      
      jQuery.create('GoodBye', {
          say_bye : function() { return "Good bye World"; }
      });

      jQuery.create('Communicator', {
          mixins: ['Greeter', 'GoodBye']
      });

      jQuery.create('MyClass', {

        mixins: 'Communicator',

        say_something: function() { return this.say_hello() + " | " + this.say_bye(); }
      });
    }, 

    teardown: function() {
      delete Greeter;
      delete GoodBye;
      delete Communicator;
      delete MyClass;
    }

  });

  test("Recursivly defined Mixins", function() {    

    var instance = new MyClass();   
    
    equal( instance.say_something(), "Hello World again | Good bye World" );

    deepEqual(instance.klass.mixins, [Communicator]);
    deepEqual(instance.klass.mixins[0].mixins, [Greeter, GoodBye]);
  });

})();
