(function() {
  
  module("Inheritance", {

    setup: function() {
    
      
      jQuery.create('Person', {

        initialize: function(name, age) {
            this.name = name;
            this.age = age;
        },

        say_hello: function() { return "Hello, my name is " + this.name + " and i'm " + this.age + " years old"; }
      });

      jQuery.create('Student', {

        extend: 'Person',
      
        initialize: function(name, age, studentid) {
            this.studentid = studentid;
            this.initParent(name, age);
        },

        study: function() { return "I'm studying and my id is: " + this.studentid; }
      });

      jQuery.create('ExStudent', {

        extend: 'Student',
      
        initialize: function(name, age) {
            this.initParent(name, age, 'nonumber');
        }
      });

      jQuery.create('MyNode', {

        extend: jQuery,

        initialize: function(dom_node) {
          this.init(dom_node); // this is method inherited by jQuery.prototype
        },
  
        show_text: function() {
          this.html("Hello World"); // now we can use `this` as a jQuery Object...
          return this;
        }
      });  
    }, 

    teardown: function() {
      delete Person;
      delete Student;
      delete ExStudent;
    }

  });

  test("Simple Class", function() {

    var person = new Person('John Doe', 31);

    equal( person.say_hello(), "Hello, my name is John Doe and i'm 31 years old" );
    equal( person.name,        'John Doe' );
    equal( person.age,         31 );

    equal( person.klass.toString(), "Person" );
    equal( person.mixins, undefined );
    deepEqual( person.klass.mixins, [] );
  });


  test("1. Inheritance Level", function() {
  
    var stud = new Student('John Doe', 31, 12334);

    equal( stud.say_hello(), "Hello, my name is John Doe and i'm 31 years old" );
    equal( stud.study(),     "I'm studying and my id is: 12334" );
    equal( stud.name,        'John Doe' );
    equal( stud.age,         31 );
    equal( stud.studentid,   12334 );

    equal( stud.klass.toString(),            "Student" );
    equal( stud.klass.superclass.toString(), "Person"  );
    equal( stud.klass.superclass.superclass, undefined );
  });

  test("2. Inheritance Level", function() {
  
    var stud = new ExStudent('John Doe', 31);

    equal( stud.say_hello(), "Hello, my name is John Doe and i'm 31 years old" );
    equal( stud.study(),     "I'm studying and my id is: nonumber" );
    equal( stud.name,        'John Doe' );
    equal( stud.age,         31 );
    equal( stud.studentid,   "nonumber" );

    equal( stud.klass.toString(),                       "ExStudent" );
    equal( stud.klass.superclass.toString(),            "Student" );
    equal( stud.klass.superclass.superclass.toString(), "Person" );
    equal( stud.klass.superclass.superclass.superclass, undefined );
  });

  test("jQuery integration", function() {
    
    var node = new MyNode('#foo');
    node.show_text().hide();
  
    equal( $('#foo').html(), "Hello World" );
    equal( $('#foo').is(':visible'), false );

    node.show();
    
    equal( $('#foo').is(':visible'), true );

    equal( node.parent()[0], $('#foo').parent()[0] );

    equal( node.klass.superclass, jQuery , "superclass is jQuery");
  });
  
})();
