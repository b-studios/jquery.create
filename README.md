An Object-Orientation System for jQuery
=======================================

**WARNING** This plugin is in early development stage and only tested in Chromium 13.0/Linux and Firefox 7.01/Linux
Of course [jquery](http://jQuery.com) is required for this plugin to work.

Features
--------

  - inheritence
  - mixins
  - a little bit reflection
  - easy way to integrate a jquery object into your own OO-Class


Example: Usage of Classes
-------------------------

    jQuery.create('Person', {

        initialize: function(name, age) {
            this.name = name;
            this.age = age;
        },
  
        say_hello: function() {
            console.log("Hello, my name is " + this.name + " and i'm " + this.age + " years old");  
        }

    });

    jQuery.create('Student', {
  
        extend: 'Person',
      
        initialize: function(name, age, studentid) {
            this.studentid = studentid;
            console.log("Initializing Student");
            this.initParent(name, age);          
        },

        study: function() {
            console.log("I'm studying and my id is: " + this.studentid);
        }
    });

    var stud = new Student('John Doe', 31, 12334);

    stud.say_hello() //=> "Hello, my name is John Doe and i'm 31 years old"
    stud.study()     //=> "I'm studying and my id is: 12334"

    stud.klass                       //=> Student
    stud.klass.superclass            //=> Person
    stud.klass.superclass.superclass //=> undefined


Example: Combination with jQuery
--------------------------------

    jQuery.create('MyNode', {

        extend: jQuery,

        initialize: function(dom_node) {
            this.init(dom_node); // this is method inherited by jQuery.prototype
        },
  
        show_text: function() {
            this.html("Hello World"); // now we can use `this` as a jQuery Object...
        }
    });

    var node = new MyNode("#foo");
    node.show_text(); //=> displays "Hello World"


Example: Usage of Mixins
------------------------
Mixins will not be initialized calling `initParent()`. They only provide a way to enhance a class
with methods and attributes. They are included recursive, i.e. if a mixin includes other mixins, those
will be added to the class aswell.

    jQuery.create('Greeter', {

        say_hello: function() {
            console.log("Hello World again");
        }

    });
    
    jQuery.create('GoodBye', {

        say_bye : function() {
            console.log("Good bye World");
        }

    });

    jQuery.create('Communicator', {
        mixins: ['Greeter', 'GoodBye']
    });

    jQuery.create('MyClass', {

        mixins: 'Communicator',

        say_something: function() {
            this.say_hello();
            this.say_bye();
        }

    });

    var instance = new MyClass();
    instance.say_something(); //=> "Hello World again"
                              //=> "Good bye World"

    instance.klass.mixins           //=> [Communicator]
    instance.klass.mixins[0].mixins //=> [Greeter, GoodBye]
